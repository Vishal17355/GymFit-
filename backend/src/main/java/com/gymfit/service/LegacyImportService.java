package com.gymfit.service;

import com.fasterxml.jackson.databind.*;
import com.gymfit.dto.DietDtos.*;
import com.gymfit.entity.LegacyDietImport;
import com.gymfit.exception.DietException;
import com.gymfit.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

@Service @Transactional
public class LegacyImportService {
    private final LegacyDietImportRepository imports;
    private final UserProfileRepository profiles;
    private final ProfileService service;
    private final ObjectMapper json;
    public LegacyImportService(LegacyDietImportRepository imports,UserProfileRepository profiles,ProfileService service,ObjectMapper json) { this.imports=imports;this.profiles=profiles;this.service=service;this.json=json; }
    public ImportReceipt archive(String user,ImportRequest request) {
        try {
            String data=json.writeValueAsString(request.legacyData());
            if(!request.legacyData().isObject() || data.getBytes(StandardCharsets.UTF_8).length>2_000_000)
                throw DietException.invalid("Legacy data must be a JSON object smaller than 2 MB.");
            String fingerprint=HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(data.getBytes(StandardCharsets.UTF_8)));
            var existing=imports.findByUserIdAndFingerprint(user,fingerprint);
            if(existing.isPresent()) {var i=existing.get();return new ImportReceipt(i.id,i.fingerprint,i.importedAt,true);}
            if(profiles.findByUserId(user).isEmpty()) service.save(user,request.profile(),true);
            LegacyDietImport i=new LegacyDietImport();i.userId=user;i.fingerprint=fingerprint;i.payload=data;imports.saveAndFlush(i);
            return new ImportReceipt(i.id,i.fingerprint,i.importedAt,false);
        } catch(DietException e) {throw e;} catch(Exception e){throw new IllegalStateException("Could not import legacy data",e);}
    }
    public List<ImportReceipt> list(String user) {return imports.findByUserIdOrderByImportedAtDesc(user).stream().map(i->new ImportReceipt(i.id,i.fingerprint,i.importedAt,true)).toList();}
    public JsonNode get(String user,long id) {
        var item=imports.findByIdAndUserId(id,user).orElseThrow(()->DietException.missing("Legacy archive not found."));
        try{return json.readTree(item.payload);}catch(Exception e){throw new IllegalStateException("Invalid archive",e);}
    }
}
