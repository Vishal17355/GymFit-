package com.gymfit.config;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.cors.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

@Configuration
public class SecurityConfig {
    @Bean SecurityFilterChain security(HttpSecurity http,
            @Value("${gymfit.security.demo:false}") boolean demo,
            @Value("${gymfit.security.issuer:}") String issuer,
            @Value("${gymfit.security.audience:gymfit}") String audience,
            @Value("${server.address:127.0.0.1}") String address) throws Exception {
        http.csrf(csrf -> csrf.disable()).cors(cors -> {}).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(a -> a.requestMatchers("/api/v1/status").permitAll().anyRequest().authenticated())
            .exceptionHandling(e -> e.authenticationEntryPoint((req, res, ex) -> {
                res.setStatus(401); res.setContentType("application/json");
                res.getWriter().write("{\"code\":\"UNAUTHENTICATED\",\"message\":\"Sign in through the configured identity provider.\"}");
            }));
        if (demo) {
            if (!Set.of("127.0.0.1", "localhost", "::1").contains(address))
                throw new IllegalStateException("Demo mode must bind to localhost.");
            LoggerFactory.getLogger(SecurityConfig.class).warn("DEMO MODE: one shared local demo identity. No real account authentication.");
            http.addFilterBefore(new OncePerRequestFilter() {
                @Override protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain) throws ServletException, IOException {
                    if (SecurityContextHolder.getContext().getAuthentication() == null)
                        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                            "local-demo-member", null, List.of(new SimpleGrantedAuthority("ROLE_DEMO"))));
                    chain.doFilter(req, res);
                }
            }, AnonymousAuthenticationFilter.class);
        } else {
            if (issuer.isBlank()) throw new IllegalStateException("JWT_ISSUER_URI is required outside explicit local demo mode.");
            NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(issuer);
            decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(JwtValidators.createDefaultWithIssuer(issuer), token ->
                token.getAudience().contains(audience) && token.getSubject() != null && !token.getSubject().isBlank() && token.getSubject().length() <= 180
                    ? OAuth2TokenValidatorResult.success() : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token"))));
            http.oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.decoder(decoder)));
        }
        return http.build();
    }
    @Bean CorsConfigurationSource cors(@Value("${gymfit.cors-origin}") String origin) {
        CorsConfiguration c = new CorsConfiguration(); c.setAllowedOrigins(List.of(origin));
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(List.of("Content-Type", "Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/api/**", c); return source;
    }
}
