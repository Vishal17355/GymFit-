import React, { useEffect, useState } from 'react';
import { nutritionTools as api } from '../../services/nutritionToolsApi';
import { Action, Empty, field, panel } from '../../pages/HomeWorkout/ui';

export function NutritionCircles({ demo }) {
  const [mine, setMine] = useState(null);
  const [discovery, setDiscovery] = useState([]);
  const [detail, setDetail] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [kind, setKind] = useState('GROUP');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [discoverable, setDiscoverable] = useState(false);
  const [code, setCode] = useState('');
  const [text, setText] = useState('');
  const [reply, setReply] = useState(null);
  const circleId = detail?.circle.id;

  async function refresh(signal) {
    const [joined, available] = await Promise.all([api.circles(signal), api.discover(signal)]);
    if (!signal?.aborted) { setMine(joined); setDiscovery(available); }
  }
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal).catch(failure => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, []);

  async function run(work) {
    setBusy(true); setError('');
    try { return await work(); }
    catch (failure) { setError(failure.message); return null; }
    finally { setBusy(false); }
  }
  function open(data) { setDetail(data); setText(''); setReply(null); }
  function join(body) {
    run(async () => { const result = await api.join({ ...body, displayName: nickname }); open(result); await refresh(); setCode(''); });
  }

  return <div className="space-y-4">
    <section className={`${panel} space-y-4`}><h2 className="text-xl font-black">Groups and household spaces</h2>
      <p className="text-sm text-slate-500">Share check-ins with members. Diary logs, weights, photos and activity totals are private to each account.</p>
      {demo && <p className="text-xs text-amber-700 dark:text-amber-300">Demo visitors share a single account. Use test content only.</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <label className="block text-xs">Display name for new circles<input required className={field} maxLength={40} value={nickname} onChange={event => setNickname(event.target.value)} /></label>
      <div className="grid md:grid-cols-2 gap-4">
        <form className="space-y-2" onSubmit={event => { event.preventDefault(); run(async () => {
          open(await api.create({ kind, name, displayName: nickname, discoverable })); setName(''); await refresh();
        }); }}>
          <h3 className="font-bold">Create a space</h3>
          <label className="block text-xs">Space name<input required maxLength={80} className={field} value={name} onChange={event => setName(event.target.value)} /></label>
          <label className="block text-xs">Space type<select className={field} value={kind} onChange={event => setKind(event.target.value)}><option value="GROUP">Group</option><option value="HOUSEHOLD">Private household</option></select></label>
          {kind === 'GROUP' && <label className="flex gap-2 text-xs items-center"><input type="checkbox" checked={discoverable} onChange={event => setDiscoverable(event.target.checked)} />List this group in Discover</label>}
          <Action type="submit" disabled={busy || !nickname.trim()}>Create space</Action>
        </form>
        <form className="space-y-2" onSubmit={event => { event.preventDefault(); join({ code }); }}>
          <h3 className="font-bold">Join with an invitation</h3>
          <label className="block text-xs">Invitation code<input required maxLength={48} className={field} value={code} onChange={event => setCode(event.target.value)} /></label>
          <Action type="submit" disabled={busy || !nickname.trim()}>Join space</Action>
        </form>
      </div>
    </section>
    <section className={`${panel} space-y-3`}><h3 className="font-black">Your spaces</h3>
      {mine == null && !error && <p role="status">Loading spaces…</p>}
      {mine?.length === 0 && <Empty>You haven't joined any spaces.</Empty>}
      <div className="flex flex-wrap gap-2">{mine?.map(circle => <Action key={circle.id} secondary={circle.id !== circleId} disabled={busy} onClick={() => run(async () => open(await api.circle(circle.id)))}>{circle.name}</Action>)}</div>
      <h3 className="font-black">Discover groups</h3>
      {!discovery.length && <p className="text-sm text-slate-500">There are no discoverable groups yet.</p>}
      {discovery.map(circle => <div className="flex flex-wrap items-center justify-between gap-2 text-sm" key={circle.id}><span>{circle.name}</span>
        <Action secondary disabled={busy || !nickname.trim() || mine?.some(joined => joined.id === circle.id)} onClick={() => join({ circleId: circle.id })}>Join group</Action></div>)}
    </section>
    {detail && <section className={`${panel} space-y-4`}><div><p className="text-xs text-slate-500">{detail.circle.kind === 'HOUSEHOLD' ? 'Private household' : 'Group feed'}</p><h3 className="text-lg font-black break-words">{detail.circle.name}</h3></div>
      {detail.circle.inviteCode && <label className="block text-xs">Share this invitation code<input readOnly className={field} value={detail.circle.inviteCode} onFocus={event => event.target.select()} /></label>}
      <form className="space-y-2" onSubmit={event => { event.preventDefault(); run(async () => {
        setDetail(await api.post(circleId, { body: text, parentId: reply })); setText(''); setReply(null);
      }); }}>
        <label className="block text-sm">{reply ? 'Reply to check-in' : 'Share a check-in'}<textarea className={field} required maxLength={800} value={text} onChange={event => setText(event.target.value)} /></label>
        <Action type="submit" disabled={busy || !text.trim()}>{reply ? 'Post reply' : 'Post check-in'}</Action>
        {reply && <Action secondary className="ml-2" onClick={() => setReply(null)}>Cancel reply</Action>}
      </form>
      {!detail.feed.length && <Empty>No check-ins yet.</Empty>}
      {detail.feed.filter(post => post.parentId == null).map(post => <article key={post.id} className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3 space-y-2">
        <p className="text-xs text-slate-500 break-words">{post.author} · {new Date(post.postedAt).toLocaleString()}</p>
        <p className="text-sm whitespace-pre-wrap break-words">{post.body}</p>
        <div className="flex flex-wrap gap-2"><Action secondary disabled={busy} aria-pressed={post.reacted} onClick={() => run(async () => setDetail(await api.react(circleId, post.id, !post.reacted)))}>{post.reacted ? 'Remove reaction' : 'React'} · {post.reactions}</Action>
          <Action secondary onClick={() => setReply(post.id)}>Reply</Action></div>
        {detail.feed.filter(comment => comment.parentId === post.id).reverse().map(comment => <div key={comment.id} className="border-l-2 border-cyan-400 pl-3 text-sm break-words"><strong>{comment.author}</strong> {comment.body}</div>)}
      </article>)}
      <section><h4 className="font-black">Check-in leaderboard</h4><ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">{detail.leaderboard.map((member, index) => <li key={index}>{member.displayName} · {member.checkIns} check-ins</li>)}</ol></section>
    </section>}
  </div>;
}
