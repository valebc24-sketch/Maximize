import React, { useState, useEffect } from 'react';
import { Brain, Eye, Ear, Hand, Zap, Clock, Focus, Sparkles, ChevronRight, Check, BookOpen, Trophy, Lightbulb, FileText, Plus, X, Star, Film, GraduationCap, Upload, Globe, Home, Settings, Flame, ArrowLeft, Type, Volume2, ScrollText, Wand2, Sliders, TrendingUp, Bookmark, Highlighter } from 'lucide-react';

// ============== MAIN APP ==============
export default function MaximizeApp() {
  const [phase, setPhase] = useState('splash');
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [profile, setProfile] = useState(null);
  const [classes, setClasses] = useState([]);
  const [tab, setTab] = useState('home');
  const [topic, setTopic] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [customLessons, setCustomLessons] = useState([]);
  const [savedDocs, setSavedDocs] = useState([]);
  const [openDoc, setOpenDoc] = useState(null);
  const [prefs, setPrefs] = useState({ fontSize: 'normal', showImages: true, showProgress: true, sounds: false });

  const questions = [
    { id: 'modality', q: 'When learning something new, what helps you most?', icon: Brain, opts: [
      { v: 'visual', l: 'Seeing diagrams or videos', icon: Eye },
      { v: 'auditory', l: 'Listening to explanations', icon: Ear },
      { v: 'kinesthetic', l: 'Hands-on practice', icon: Hand },
      { v: 'reading', l: 'Reading text and taking notes', icon: BookOpen },
    ]},
    { id: 'attention', q: 'How long can you typically focus?', icon: Clock, opts: [
      { v: 'short', l: 'Less than 10 minutes' },
      { v: 'medium', l: '10–25 minutes comfortably' },
      { v: 'long', l: '30+ minutes when interested' },
      { v: 'variable', l: 'Depends on the topic' },
    ]},
    { id: 'pace', q: 'What pace works best?', icon: Zap, opts: [
      { v: 'fast', l: 'Quick bursts with variety' },
      { v: 'steady', l: 'Steady and methodical' },
      { v: 'slow', l: 'Slow with time to reflect' },
      { v: 'mixed', l: 'Mix it up' },
    ]},
    { id: 'challenges', q: 'Do any of these describe you? (Select all)', icon: Focus, multi: true, opts: [
      { v: 'adhd', l: 'I have ADHD or trouble focusing' },
      { v: 'dyslexia', l: 'I have dyslexia or read more slowly' },
      { v: 'anxiety', l: 'I get anxious with tests' },
      { v: 'sensory', l: 'I am sensitive to busy visuals or sound' },
      { v: 'none', l: 'None of these apply' },
    ]},
    { id: 'motivation', q: 'What keeps you motivated?', icon: Sparkles, opts: [
      { v: 'progress', l: 'Seeing visible progress' },
      { v: 'curiosity', l: 'Following my curiosity' },
      { v: 'goals', l: 'Working toward a specific goal' },
      { v: 'social', l: 'Friendly competition' },
    ]},
  ];

  const onAns = (id, v, multi) => {
    if (multi) {
      const cur = answers[id] || [];
      const next = v === 'none' ? (cur.includes('none') ? [] : ['none']) :
        cur.includes(v) ? cur.filter(x => x !== v) : [...cur.filter(x => x !== 'none'), v];
      setAnswers({ ...answers, [id]: next });
    } else {
      setAnswers({ ...answers, [id]: v });
      setTimeout(() => qIdx < questions.length - 1 ? setQIdx(qIdx + 1) : build({ ...answers, [id]: v }), 350);
    }
  };

  const build = (a) => {
    const c = a.challenges || [];
    const p = {
      modality: a.modality, attention: a.attention, pace: a.pace, motivation: a.motivation,
      hasADHD: c.includes('adhd'), hasDyslexia: c.includes('dyslexia'),
      hasAnxiety: c.includes('anxiety'), hasSensory: c.includes('sensory'),
      chunkSize: c.includes('adhd') || a.attention === 'short' ? 'small' : 'normal',
      breakReminders: c.includes('adhd'), reducedMotion: c.includes('sensory'),
      largerText: c.includes('dyslexia'), gentleFeedback: c.includes('anxiety'),
    };
    setProfile(p);
    if (c.includes('dyslexia')) setPrefs(pr => ({ ...pr, fontSize: 'large' }));
    setPhase('profile');
  };

  const reset = () => { setPhase('splash'); setQIdx(0); setAnswers({}); setProfile(null); setClasses([]);
    setTab('home'); setTopic(null); setProgress(0); setCompleted([]); setCustomLessons([]); setSavedDocs([]); };

  const complete = (id) => { if (!completed.includes(id)) setCompleted([...completed, id]); };

  const bg = { background: `radial-gradient(ellipse at 20% 10%, rgba(255,107,107,0.25) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(255,199,95,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(78,168,222,0.15) 0%, transparent 70%), linear-gradient(180deg, #fef4d8 0%, #fde0a8 100%)` };

  if (phase === 'splash') return <Splash onGo={() => setPhase('founder')} bg={bg} />;
  if (phase === 'founder') return <Founder onGo={() => setPhase('survey')} bg={bg} />;
  if (phase === 'survey') return <Survey q={questions[qIdx]} idx={qIdx} total={questions.length} ans={answers} onAns={onAns} onNext={() => qIdx < questions.length - 1 ? setQIdx(qIdx + 1) : build(answers)} bg={bg} />;
  if (phase === 'profile') return <ProfileScreen profile={profile} onGo={() => setPhase('classroom')} onReset={reset} bg={bg} />;
  if (phase === 'classroom') return <Classroom classes={classes} setClasses={setClasses} profile={profile} onGo={() => setPhase('app')} bg={bg} />;

  return (
    <Shell tab={tab} setTab={setTab} bg={bg} prefs={prefs}>
      {topic ? <Lesson topic={topic} profile={profile} progress={progress} setProgress={setProgress}
        onExit={() => { setTopic(null); setProgress(0); }} onDone={() => complete(topic.id)} prefs={prefs} />
      : openDoc ? <Reader doc={openDoc} onExit={() => setOpenDoc(null)} prefs={prefs} />
      : tab === 'home' ? <HomeTab classes={classes} customLessons={customLessons} setCustomLessons={setCustomLessons} onPick={setTopic} completed={completed} />
      : tab === 'progress' ? <ProgressTab completed={completed} classes={classes} profile={profile} />
      : tab === 'library' ? <LibraryTab classes={classes} setClasses={setClasses} />
      : tab === 'reader' ? <ReaderHub savedDocs={savedDocs} setSavedDocs={setSavedDocs} onOpen={setOpenDoc} />
      : <SettingsTab profile={profile} prefs={prefs} setPrefs={setPrefs} onReset={reset} />}
    </Shell>
  );
}

// ============== APP SHELL ==============
function Shell({ tab, setTab, children, bg, prefs }) {
  const tabs = [
    { id: 'home', l: 'Lessons', icon: Home },
    { id: 'progress', l: 'Progress', icon: TrendingUp },
    { id: 'library', l: 'Library', icon: BookOpen },
    { id: 'reader', l: 'Reader', icon: ScrollText },
    { id: 'settings', l: 'Settings', icon: Settings },
  ];
  return (
    <div className="min-h-screen w-full relative pb-24" style={{ ...bg, fontFamily: prefs.fontSize === 'large' ? 'Verdana, sans-serif' : '"Bodoni Moda", Georgia, serif' }}>
      <div className="sticky top-0 z-40 bg-stone-900 text-amber-50 px-6 py-3 border-b-4 border-red-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-amber-300" />
          <div className="text-xl font-black">MAXI<em className="italic font-normal text-amber-300">mize</em></div>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] text-amber-300" style={{ fontFamily: '"Futura", sans-serif' }}>
          {tabs.find(t => t.id === tab)?.l}
        </div>
      </div>
      <div className="px-4 md:px-6 py-6 max-w-5xl mx-auto">{children}</div>
      <div className="fixed bottom-0 left-0 right-0 bg-stone-900 border-t-4 border-red-700 z-50">
        <div className="max-w-5xl mx-auto flex">
          {tabs.map(t => {
            const I = t.icon, on = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all relative ${on ? 'text-amber-300' : 'text-stone-400 hover:text-amber-100'}`}
                style={{ fontFamily: '"Futura", sans-serif' }}>
                {on && <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-red-700" />}
                <I className="w-5 h-5" strokeWidth={on ? 2.5 : 1.5} />
                <div className="text-[10px] tracking-widest uppercase font-bold">{t.l}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============== HOME TAB ==============
function HomeTab({ classes, customLessons, setCustomLessons, onPick, completed }) {
  const [show, setShow] = useState(false);
  const [t, setT] = useState(''), [d, setD] = useState(''), [s, setS] = useState('balanced');

  const classTopics = classes.flatMap(c => [
    { id: `${c.id}-overview`, title: `${c.name} — Overview`, emoji: '📘', source: c.name, fromClass: true },
    { id: `${c.id}-review`, title: `${c.name} — Recent`, emoji: '🎯', source: c.name, fromClass: true },
  ]);

  const add = () => {
    if (t.trim()) {
      setCustomLessons([...customLessons, { id: `c-${Date.now()}`, title: t, description: d, style: s, emoji: '✨', source: 'Custom', isCustom: true }]);
      setT(''); setD(''); setS('balanced'); setShow(false);
    }
  };

  return (
    <div>
      <div className="bg-amber-50/80 border-4 border-stone-900 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)] flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-red-800 font-bold mb-1" style={{ fontFamily: '"Futura", sans-serif' }}>Welcome Back</div>
          <h2 className="text-3xl font-black text-stone-900">Ready to <em className="italic text-red-800">learn?</em></h2>
        </div>
        <div className="flex items-center gap-2 bg-red-700 text-amber-50 px-4 py-2" style={{ fontFamily: '"Futura", sans-serif' }}>
          <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
          <div className="text-sm uppercase tracking-widest">3 Day Streak</div>
        </div>
      </div>

      {show ? (
        <div className="bg-stone-900 text-amber-50 border-4 border-red-700 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-amber-300" /><div className="font-bold text-xl">Create a Custom Lesson</div></div>
            <button onClick={() => setShow(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <input value={t} onChange={e => setT(e.target.value)} placeholder="What do you want to learn?"
              className="w-full p-3 bg-stone-800 border-2 border-stone-700 text-amber-50 focus:outline-none focus:border-amber-300" />
            <textarea value={d} onChange={e => setD(e.target.value)} rows={3} placeholder="What should it cover? (optional)"
              className="w-full p-3 bg-stone-800 border-2 border-stone-700 text-amber-50 focus:outline-none focus:border-amber-300 resize-none" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { id: 'visual-heavy', l: 'Visual-Heavy', d: 'Lots of diagrams' },
                { id: 'story', l: 'Story-Based', d: 'Narrative flow' },
                { id: 'balanced', l: 'Balanced', d: 'A bit of everything' },
                { id: 'practical', l: 'Practical', d: 'Examples first' },
              ].map(o => (
                <button key={o.id} onClick={() => setS(o.id)}
                  className={`p-3 border-2 text-left transition-all ${s === o.id ? 'border-amber-300 bg-red-700' : 'border-stone-700 hover:border-amber-300'}`}>
                  <div className="text-sm font-bold">{o.l}</div>
                  <div className="text-xs text-stone-300">{o.d}</div>
                </button>
              ))}
            </div>
            <button onClick={add} disabled={!t.trim()}
              className={`w-full p-3 tracking-widest uppercase text-sm ${t.trim() ? 'bg-amber-300 text-stone-900 hover:bg-amber-400' : 'bg-stone-700 text-stone-500'}`}
              style={{ fontFamily: '"Futura", sans-serif' }}>Generate Lesson</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShow(true)}
          className="w-full p-5 mb-6 bg-stone-900 text-amber-50 border-4 border-red-700 hover:bg-red-800 transition-all flex items-center justify-between shadow-[6px_6px_0_rgba(180,83,9,0.6)] hover:shadow-[3px_3px_0_rgba(180,83,9,0.6)] hover:translate-x-[3px] hover:translate-y-[3px]">
          <div className="flex items-center gap-3">
            <Wand2 className="w-6 h-6 text-amber-300" />
            <div className="text-left">
              <div className="font-bold text-lg">Create Custom Lesson</div>
              <div className="text-xs text-stone-300 tracking-widest uppercase" style={{ fontFamily: '"Futura", sans-serif' }}>Tell us what to teach</div>
            </div>
          </div>
          <Plus className="w-6 h-6" />
        </button>
      )}

      {customLessons.length > 0 && <>
        <Section title="Your Custom Lessons" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {customLessons.map(t => <LessonCard key={t.id} topic={t} onClick={() => onPick(t)} done={completed.includes(t.id)} hi />)}
        </div>
      </>}

      {classTopics.length > 0 && <>
        <Section title="From Your Classes" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {classTopics.map(t => <LessonCard key={t.id} topic={t} onClick={() => onPick(t)} done={completed.includes(t.id)} />)}
        </div>
      </>}

      <Section title="Featured Lessons" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allTopics.map(t => <LessonCard key={t.id} topic={t} onClick={() => onPick(t)} done={completed.includes(t.id)} />)}
      </div>
    </div>
  );
}

function Section({ title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="text-xs uppercase tracking-[0.3em] text-stone-700 font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>{title}</div>
      <div className="flex-1 h-[2px] bg-stone-700/30" />
    </div>
  );
}

function LessonCard({ topic, onClick, done, hi }) {
  return (
    <button onClick={onClick}
      className={`text-left p-5 border-2 transition-all relative ${
        hi ? 'bg-amber-300 border-stone-900 hover:bg-amber-400 shadow-[4px_4px_0_rgba(180,83,9,0.6)] hover:shadow-[2px_2px_0_rgba(180,83,9,0.6)] hover:translate-x-[2px] hover:translate-y-[2px]'
        : 'bg-amber-50/80 border-stone-700 hover:border-stone-900 hover:bg-amber-50 shadow-[3px_3px_0_rgba(180,83,9,0.4)]'}`}>
      {done && <div className="absolute top-3 right-3 w-7 h-7 bg-green-700 text-amber-50 flex items-center justify-center"><Check className="w-4 h-4" strokeWidth={3} /></div>}
      <div className="text-3xl mb-3">{topic.emoji}</div>
      <div className="text-base font-bold text-stone-900 mb-2 pr-8 leading-tight">{topic.title}</div>
      <div className="text-xs uppercase tracking-widest text-stone-600" style={{ fontFamily: '"Futura", sans-serif' }}>{topic.source}</div>
    </button>
  );
}

// ============== PROGRESS TAB ==============
function ProgressTab({ completed, classes, profile }) {
  const mins = completed.length * 12 + 35;
  const week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const wd = [25, 18, 32, 0, 15, 28, 12];
  const goals = [
    { l: 'First Lesson', n: 1, icon: BookOpen, cur: completed.length },
    { l: '5 Lessons', n: 5, icon: Star, cur: completed.length },
    { l: '10 Lessons', n: 10, icon: Trophy, cur: completed.length },
    { l: 'Week Warrior', n: 7, icon: Flame, cur: 3 },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat l="Lessons" v={completed.length} icon={BookOpen} c="bg-red-700" />
        <Stat l="Streak" v={3} icon={Flame} c="bg-amber-500" />
        <Stat l="Minutes" v={mins} icon={Clock} c="bg-stone-900" />
        <Stat l="Classes" v={classes.length} icon={GraduationCap} c="bg-blue-700" />
      </div>

      <div className="bg-amber-50/80 border-4 border-stone-900 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-black text-stone-900">This Week</h3>
          <div className="text-xs uppercase tracking-widest text-stone-600" style={{ fontFamily: '"Futura", sans-serif' }}>Daily Focus</div>
        </div>
        <div className="flex items-end gap-2 h-40">
          {week.map((d, i) => {
            const h = Math.max((wd[i] / 35) * 100, 4);
            const today = i === 2;
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-stone-700">{wd[i]}m</div>
                <div className="w-full bg-amber-200/60 border-2 border-stone-700 relative" style={{ height: '120px' }}>
                  <div className={`absolute bottom-0 left-0 right-0 ${today ? 'bg-red-700' : 'bg-stone-900'}`} style={{ height: `${h}%` }} />
                </div>
                <div className={`text-xs uppercase font-bold ${today ? 'text-red-800' : 'text-stone-700'}`} style={{ fontFamily: '"Futura", sans-serif' }}>{d}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Section title="Milestones" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {goals.map((g, i) => {
          const I = g.icon, earned = g.cur >= g.n;
          return (
            <div key={i} className={`p-4 border-2 text-center ${earned ? 'bg-red-700 text-amber-50 border-stone-900 shadow-[3px_3px_0_rgba(180,83,9,0.6)]' : 'bg-amber-50/50 border-stone-400 text-stone-500'}`}>
              <I className={`w-8 h-8 mx-auto mb-2 ${earned ? 'fill-amber-300 text-amber-300' : ''}`} strokeWidth={1.5} />
              <div className="text-xs uppercase tracking-widest font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>{g.l}</div>
              {!earned && <div className="text-[10px] mt-1 opacity-70">{g.cur}/{g.n}</div>}
            </div>
          );
        })}
      </div>

      <Section title="Your Learning Profile" />
      <div className="bg-amber-50/80 border-2 border-stone-700 p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Fact l="Style" v={profile?.modality} />
          <Fact l="Pace" v={profile?.pace} />
          <Fact l="Focus" v={profile?.attention} />
          <Fact l="Motivation" v={profile?.motivation} />
          <Fact l="Chunk Size" v={profile?.chunkSize} />
          <Fact l="Accommodations" v={[profile?.hasADHD && 'ADHD', profile?.hasDyslexia && 'Dyslexia', profile?.hasAnxiety && 'Anxiety', profile?.hasSensory && 'Sensory'].filter(Boolean).join(', ') || 'None'} />
        </div>
      </div>
    </div>
  );
}

function Stat({ l, v, icon: I, c }) {
  return (
    <div className={`${c} text-amber-50 p-4 border-2 border-stone-900 shadow-[3px_3px_0_rgba(180,83,9,0.6)]`}>
      <I className="w-5 h-5 mb-2" strokeWidth={1.5} />
      <div className="text-3xl font-black">{v}</div>
      <div className="text-xs uppercase tracking-widest mt-1" style={{ fontFamily: '"Futura", sans-serif' }}>{l}</div>
    </div>
  );
}

function Fact({ l, v }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-stone-600 mb-1" style={{ fontFamily: '"Futura", sans-serif' }}>{l}</div>
      <div className="text-stone-900 font-bold capitalize">{v || '—'}</div>
    </div>
  );
}

// ============== LIBRARY TAB ==============
function LibraryTab({ classes, setClasses }) {
  const [show, setShow] = useState(false);
  const [nc, setNc] = useState({ name: '', platform: '', url: '', files: [] });
  const platforms = [
    { id: 'canvas', n: 'Canvas', c: '#dc2626' },
    { id: 'blackboard', n: 'Blackboard', c: '#1f2937' },
    { id: 'google', n: 'Google Classroom', c: '#0369a1' },
    { id: 'moodle', n: 'Moodle', c: '#ea580c' },
    { id: 'schoology', n: 'Schoology', c: '#0891b2' },
    { id: 'other', n: 'Other', c: '#78350f' },
  ];
  const upload = (e) => setNc({ ...nc, files: [...nc.files, ...Array.from(e.target.files || []).map(f => ({ name: f.name }))] });
  const add = () => { if (nc.name && nc.platform) { setClasses([...classes, { ...nc, id: Date.now() }]); setNc({ name: '', platform: '', url: '', files: [] }); setShow(false); } };

  return (
    <div>
      <div className="bg-amber-50/80 border-4 border-stone-900 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
        <h2 className="text-3xl font-black text-stone-900 mb-2">Your <em className="italic text-red-800">Library.</em></h2>
        <p className="text-stone-700">Linked classes and uploaded materials. The more you add, the better Maximize personalizes.</p>
      </div>

      {classes.length > 0 && <>
        <Section title={`Linked Classes (${classes.length})`} />
        <div className="space-y-3 mb-6">
          {classes.map(cls => {
            const p = platforms.find(x => x.id === cls.platform);
            return (
              <div key={cls.id} className="bg-amber-50/80 border-2 border-stone-900 p-5 shadow-[3px_3px_0_rgba(180,83,9,0.5)] flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 flex items-center justify-center text-amber-50 font-bold shrink-0" style={{ backgroundColor: p?.c }}>
                    {cls.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-stone-900 text-lg">{cls.name}</div>
                    <div className="text-sm text-stone-600 flex items-center gap-2 mt-1"><Globe className="w-3 h-3" /> {p?.n}</div>
                    {cls.files.length > 0 && <div className="text-xs text-stone-600 mt-2 flex items-center gap-1"><FileText className="w-3 h-3" /> {cls.files.length} file{cls.files.length !== 1 ? 's' : ''}</div>}
                  </div>
                </div>
                <button onClick={() => setClasses(classes.filter(c => c.id !== cls.id))} className="text-stone-500 hover:text-red-700"><X className="w-5 h-5" /></button>
              </div>
            );
          })}
        </div>
      </>}

      {show ? (
        <div className="bg-stone-900 text-amber-50 border-4 border-red-700 p-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
          <div className="flex items-center justify-between mb-5">
            <div className="font-bold text-xl flex items-center gap-2"><Plus className="w-5 h-5 text-amber-300" /> New Class</div>
            <button onClick={() => setShow(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <input value={nc.name} onChange={e => setNc({ ...nc, name: e.target.value })} placeholder="Class name"
              className="w-full p-3 bg-stone-800 border-2 border-stone-700 text-amber-50 focus:outline-none focus:border-amber-300" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map(p => (
                <button key={p.id} onClick={() => setNc({ ...nc, platform: p.id })}
                  className={`p-2 border-2 text-sm ${nc.platform === p.id ? 'border-amber-300 bg-red-700' : 'border-stone-700 hover:border-amber-300'}`}>{p.n}</button>
              ))}
            </div>
            <input value={nc.url} onChange={e => setNc({ ...nc, url: e.target.value })} placeholder="Class URL (optional)"
              className="w-full p-3 bg-stone-800 border-2 border-stone-700 text-amber-50 focus:outline-none focus:border-amber-300" />
            <label className="block w-full p-5 border-2 border-dashed border-stone-700 text-center cursor-pointer hover:border-amber-300">
              <Upload className="w-6 h-6 mx-auto mb-2 text-amber-300" strokeWidth={1.5} />
              <div className="text-sm">Upload syllabi, slides, notes</div>
              <input type="file" multiple onChange={upload} className="hidden" />
            </label>
            {nc.files.length > 0 && nc.files.map((f, i) => <div key={i} className="text-xs flex items-center gap-2"><FileText className="w-3 h-3" /> {f.name}</div>)}
            <button onClick={add} disabled={!nc.name || !nc.platform}
              className={`w-full p-3 tracking-widest uppercase text-sm ${nc.name && nc.platform ? 'bg-amber-300 text-stone-900 hover:bg-amber-400' : 'bg-stone-700 text-stone-500'}`}
              style={{ fontFamily: '"Futura", sans-serif' }}>Save Class</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShow(true)} className="w-full p-6 border-4 border-dashed border-stone-700 bg-amber-50/40 hover:bg-amber-100/60 transition-all">
          <Plus className="w-8 h-8 mx-auto mb-2 text-stone-700" strokeWidth={2} />
          <div className="text-stone-800 font-bold tracking-widest uppercase text-sm" style={{ fontFamily: '"Futura", sans-serif' }}>Add a Class</div>
        </button>
      )}
    </div>
  );
}

// ============== READER HUB ==============
function ReaderHub({ savedDocs, setSavedDocs, onOpen }) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState(''), [text, setText] = useState('');

  const sample = {
    id: 's1', title: 'The Endosymbiotic Theory', type: 'Biology · Sample', wordCount: 320,
    content: `The endosymbiotic theory explains the origin of eukaryotic cells — the kind that have nuclei, like every cell in your body. First proposed in 1905 and popularized by Lynn Margulis in 1967, the theory says that mitochondria and chloroplasts started out as free-living bacteria that were swallowed by larger cells, but never digested.

Mitochondria, the powerhouses that make ATP for energy, came from ancient alphaproteobacteria. Roughly 1.5 to 2 billion years ago, one of these bacteria was engulfed by a host cell. Instead of being destroyed, it stayed alive and provided energy in exchange for shelter. Over time, the relationship became permanent — neither could live without the other.

Chloroplasts, found in plants and algae, came from a similar event. A eukaryotic cell engulfed a cyanobacterium, which already knew how to do photosynthesis. That partnership gave rise to every plant on Earth.

Several pieces of evidence support the theory. Both mitochondria and chloroplasts have their own DNA, separate from the nucleus, and it looks more bacterial than eukaryotic. They have their own ribosomes — and those ribosomes match bacterial ribosomes, not eukaryotic ones. They reproduce by splitting in two, just like bacteria. And they're surrounded by two membranes: the inner one from the original bacterium, the outer one from the host cell's engulfing pouch.

The implications go far beyond biology class. The theory shows that major evolutionary leaps can happen through merger — not just gradual mutation. Cooperation between organisms, not just competition, has shaped life on Earth.`,
  };

  const docs = [sample, ...savedDocs];
  const add = () => {
    if (title.trim() && text.trim()) {
      const wc = text.trim().split(/\s+/).length;
      const d = { id: `d-${Date.now()}`, title, type: 'Custom Reading', wordCount: wc, content: text };
      setSavedDocs([...savedDocs, d]);
      setTitle(''); setText(''); setShow(false); onOpen(d);
    }
  };

  return (
    <div>
      <div className="bg-amber-50/80 border-4 border-stone-900 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
        <div className="flex items-center gap-3 mb-2">
          <ScrollText className="w-7 h-7 text-red-800" strokeWidth={1.5} />
          <h2 className="text-3xl font-black text-stone-900">Reading <em className="italic text-red-800">Mode.</em></h2>
        </div>
        <p className="text-stone-700 mb-3">Drop in any text. Get a quick summary, or highlight any passage for a plain-English explanation, simpler version, or real-world example.</p>
        <div className="flex items-center gap-2 text-xs text-stone-600">
          <Highlighter className="w-4 h-4" /><span className="italic">Tip: Select any text to open the side panel.</span>
        </div>
      </div>

      {show ? (
        <div className="bg-stone-900 text-amber-50 border-4 border-red-700 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
          <div className="flex items-center justify-between mb-5">
            <div className="font-bold text-xl flex items-center gap-2"><Plus className="w-5 h-5 text-amber-300" /> New Reading</div>
            <button onClick={() => setShow(false)}><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (e.g. Chapter 3)"
              className="w-full p-3 bg-stone-800 border-2 border-stone-700 text-amber-50 focus:outline-none focus:border-amber-300" />
            <textarea value={text} onChange={e => setText(e.target.value)} rows={10} placeholder="Paste your reading material..."
              className="w-full p-3 bg-stone-800 border-2 border-stone-700 text-amber-50 focus:outline-none focus:border-amber-300 resize-none" />
            <button onClick={add} disabled={!title.trim() || !text.trim()}
              className={`w-full p-3 tracking-widest uppercase text-sm ${title.trim() && text.trim() ? 'bg-amber-300 text-stone-900 hover:bg-amber-400' : 'bg-stone-700 text-stone-500'}`}
              style={{ fontFamily: '"Futura", sans-serif' }}>Open in Reader</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShow(true)}
          className="w-full p-5 mb-6 bg-stone-900 text-amber-50 border-4 border-red-700 hover:bg-red-800 transition-all flex items-center justify-between shadow-[6px_6px_0_rgba(180,83,9,0.6)] hover:shadow-[3px_3px_0_rgba(180,83,9,0.6)] hover:translate-x-[3px] hover:translate-y-[3px]">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-amber-300" />
            <div className="text-left">
              <div className="font-bold text-lg">Add Reading</div>
              <div className="text-xs text-stone-300 tracking-widest uppercase" style={{ fontFamily: '"Futura", sans-serif' }}>Paste any text</div>
            </div>
          </div>
          <Plus className="w-6 h-6" />
        </button>
      )}

      <Section title={`Your Readings (${docs.length})`} />
      <div className="space-y-3">
        {docs.map(d => (
          <button key={d.id} onClick={() => onOpen(d)}
            className="w-full text-left bg-amber-50/80 border-2 border-stone-700 p-5 hover:border-stone-900 hover:bg-amber-50 flex items-center gap-4">
            <ScrollText className="w-8 h-8 text-red-800 shrink-0" strokeWidth={1.5} />
            <div className="flex-1">
              <div className="font-bold text-stone-900 text-lg">{d.title}</div>
              <div className="text-xs uppercase tracking-widest text-stone-600 mt-1" style={{ fontFamily: '"Futura", sans-serif' }}>
                {d.type} · {d.wordCount} words · ~{Math.ceil(d.wordCount / 200)} min read
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-stone-600" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============== READER MODE ==============
function Reader({ doc, onExit, prefs }) {
  const [showSummary, setShowSummary] = useState(false);
  const [selected, setSelected] = useState('');
  const [panel, setPanel] = useState(false);
  const [view, setView] = useState('explain');
  const [highlights, setHighlights] = useState([]);

  const onSelect = () => {
    const sel = window.getSelection();
    const t = sel.toString().trim();
    if (t.length > 3) { setSelected(t); setPanel(true); }
  };

  const save = () => {
    if (selected && !highlights.includes(selected)) setHighlights([...highlights, selected]);
    setPanel(false); window.getSelection()?.removeAllRanges();
  };

  const summary = "This reading explains the endosymbiotic theory — the idea that mitochondria and chloroplasts started as free-living bacteria that got engulfed by larger cells billions of years ago. Instead of being digested, they stuck around. Evidence: organelles have their own DNA, ribosomes match bacterial ones, and they reproduce independently. The big idea is that evolution can happen through merger, not just gradual change.";
  const points = [
    'Mitochondria came from ancient alphaproteobacteria (~1.5–2 billion years ago)',
    'Chloroplasts came from engulfed cyanobacteria (~1.5 billion years ago)',
    'Evidence: own DNA, bacterial ribosomes, double membranes, independent replication',
    'Major implication: evolution happens through cooperation, not just competition',
  ];

  const explain = (text, mode) => {
    const t = text.length > 80 ? text.slice(0, 80) + '...' : text;
    if (mode === 'simpler') return `Plain version: "${t}"\n\nIn everyday terms, this is saying that something complex happened through a few clear steps. The technical words are just precise labels for ideas you can grasp without them. Think of it like a recipe — each step builds on the last, and the result is what's being described.`;
    if (mode === 'example') return `Real-world example: "${t}"\n\nPicture two coworkers assigned to a project. At first they're independent, but they start splitting tasks — one handles research, the other handles writing. Over months, neither can finish the project alone anymore. That's the same pattern of cooperation-becoming-essential that's being described here, just at a different scale.`;
    return `Explained: "${t}"\n\nThis passage introduces a key concept and supports it with specific evidence. The main claim is being stated, then the mechanism or evidence that backs it up follows. Strip away the technical vocabulary, and the underlying idea is about a relationship — how one thing connects to, depends on, or causes another. That relationship is the takeaway worth remembering.`;
  };

  const fs = prefs.fontSize === 'large' ? 'text-xl leading-loose' : 'text-lg leading-loose';

  return (
    <div className="relative" style={{ display: 'flex', gap: '1.5rem' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <button onClick={onExit} className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 font-bold tracking-widest uppercase" style={{ fontFamily: '"Futura", sans-serif' }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={() => setShowSummary(!showSummary)}
            className={`flex items-center gap-2 px-4 py-2 border-2 transition-all text-sm tracking-widest uppercase ${
              showSummary ? 'bg-red-700 text-amber-50 border-stone-900' : 'bg-amber-50 text-stone-900 border-stone-900 hover:bg-amber-100'}`}
            style={{ fontFamily: '"Futura", sans-serif' }}>
            <Sparkles className="w-4 h-4" /> {showSummary ? 'Hide Summary' : 'Quick Summary'}
          </button>
        </div>

        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.3em] text-red-800 font-bold mb-2" style={{ fontFamily: '"Futura", sans-serif' }}>
            {doc.type} · {doc.wordCount} words · ~{Math.ceil(doc.wordCount / 200)} min read
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 leading-tight" style={{ textShadow: '2px 2px 0 #d97706' }}>{doc.title}</h1>
        </div>

        {showSummary && (
          <div className="bg-stone-900 text-amber-50 border-4 border-amber-300 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <div className="text-xs uppercase tracking-[0.3em] text-amber-300 font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>The Short Version</div>
            </div>
            <p className="text-amber-50 leading-relaxed mb-5 text-lg">{summary}</p>
            <div className="text-xs uppercase tracking-[0.3em] text-amber-300 font-bold mb-3" style={{ fontFamily: '"Futura", sans-serif' }}>Key Points</div>
            <ul className="space-y-2">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Star className="w-4 h-4 text-amber-300 mt-1 shrink-0 fill-amber-300" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {highlights.length > 0 && (
          <div className="bg-amber-100/60 border-2 border-amber-700 p-4 mb-6">
            <div className="text-xs uppercase tracking-widest text-amber-900 font-bold mb-2 flex items-center gap-2" style={{ fontFamily: '"Futura", sans-serif' }}>
              <Bookmark className="w-4 h-4" /> Saved Highlights ({highlights.length})
            </div>
            <div className="space-y-1">
              {highlights.map((h, i) => <div key={i} className="text-sm text-stone-800 italic">"{h.slice(0, 80)}{h.length > 80 ? '...' : ''}"</div>)}
            </div>
          </div>
        )}

        <div className={`bg-amber-50/90 border-4 border-stone-900 p-8 md:p-10 shadow-[8px_8px_0_rgba(180,83,9,0.6)] ${fs}`}
          style={{ fontFamily: prefs.fontSize === 'large' ? 'Verdana, sans-serif' : 'Georgia, serif' }}
          onMouseUp={onSelect} onTouchEnd={onSelect}>
          <div className="text-stone-900 whitespace-pre-line">{doc.content}</div>
          <div className="mt-8 pt-6 border-t-2 border-stone-300 text-center">
            <div className="text-xs uppercase tracking-[0.3em] text-stone-600 italic" style={{ fontFamily: '"Futura", sans-serif' }}>★ End of reading ★</div>
            <div className="text-sm text-stone-700 mt-2 italic">Highlight any sentence for an explanation</div>
          </div>
        </div>
      </div>

      {panel && (
        <>
          <div className="fixed inset-0 bg-stone-900/40 z-40 lg:hidden" onClick={() => setPanel(false)} />
          <div className="fixed lg:sticky lg:top-20 inset-x-0 bottom-0 lg:inset-auto lg:self-start z-50 lg:z-auto lg:w-[360px] lg:shrink-0 bg-stone-900 text-amber-50 border-4 border-amber-300 shadow-[8px_8px_0_rgba(180,83,9,0.8)] max-h-[80vh] lg:max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b-2 border-amber-300">
              <div className="text-xs uppercase tracking-[0.3em] text-amber-300 font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>Maximize Helper</div>
              <button onClick={() => setPanel(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex border-b-2 border-amber-300">
              {[
                { id: 'explain', l: 'Explain', icon: Lightbulb },
                { id: 'simpler', l: 'Simpler', icon: Type },
                { id: 'example', l: 'Example', icon: Sparkles },
              ].map(t => {
                const I = t.icon, on = view === t.id;
                return (
                  <button key={t.id} onClick={() => setView(t.id)}
                    className={`flex-1 px-3 py-3 flex items-center justify-center gap-2 text-xs tracking-widest uppercase ${on ? 'bg-amber-300 text-stone-900 font-bold' : 'text-amber-300 hover:bg-stone-800'}`}
                    style={{ fontFamily: '"Futura", sans-serif' }}>
                    <I className="w-4 h-4" /> {t.l}
                  </button>
                );
              })}
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <div className="text-xs uppercase tracking-[0.3em] text-amber-300 font-bold mb-3" style={{ fontFamily: '"Futura", sans-serif' }}>
                {view === 'explain' ? 'What this means' : view === 'simpler' ? 'In simpler words' : 'A real-world example'}
              </div>
              <p className="leading-relaxed whitespace-pre-line text-sm">{explain(selected, view)}</p>
            </div>
            <div className="flex border-t-2 border-stone-700">
              <button onClick={save} className="flex-1 px-4 py-3 text-xs tracking-widest uppercase text-amber-300 hover:bg-stone-800 flex items-center justify-center gap-2" style={{ fontFamily: '"Futura", sans-serif' }}>
                <Bookmark className="w-4 h-4" /> Save
              </button>
              <button onClick={() => setPanel(false)} className="flex-1 px-4 py-3 text-xs tracking-widest uppercase text-stone-400 hover:bg-stone-800 border-l-2 border-stone-700" style={{ fontFamily: '"Futura", sans-serif' }}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============== SETTINGS TAB ==============
function SettingsTab({ profile, prefs, setPrefs, onReset }) {
  return (
    <div>
      <div className="bg-amber-50/80 border-4 border-stone-900 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
        <h2 className="text-3xl font-black text-stone-900 mb-2">Settings.</h2>
        <p className="text-stone-700 text-sm">Customize how Maximize looks and behaves. Changes apply across the app.</p>
      </div>

      <Section title="Reading & Text" />
      <div className="bg-amber-50/80 border-2 border-stone-700 p-5 mb-6 space-y-5">
        <Row l="Font Size" icon={Type}>
          <div className="flex gap-2">
            {['small', 'normal', 'large'].map(s => (
              <button key={s} onClick={() => setPrefs({ ...prefs, fontSize: s })}
                className={`px-4 py-2 border-2 text-xs tracking-widest uppercase ${prefs.fontSize === s ? 'bg-stone-900 text-amber-50 border-stone-900' : 'bg-amber-100/60 text-stone-700 border-stone-400 hover:border-stone-700'}`}
                style={{ fontFamily: '"Futura", sans-serif' }}>{s}</button>
            ))}
          </div>
        </Row>
      </div>

      <Section title="Visual" />
      <div className="bg-amber-50/80 border-2 border-stone-700 p-5 mb-6 space-y-5">
        <Row l="Show Diagrams" icon={Eye}><Toggle v={prefs.showImages} onChange={x => setPrefs({ ...prefs, showImages: x })} /></Row>
        <Row l="Show Progress Bars" icon={Sliders}><Toggle v={prefs.showProgress} onChange={x => setPrefs({ ...prefs, showProgress: x })} /></Row>
        <Row l="Sound Effects" icon={Volume2}><Toggle v={prefs.sounds} onChange={x => setPrefs({ ...prefs, sounds: x })} /></Row>
      </div>

      <Section title="Your Profile" />
      <div className="bg-amber-50/80 border-2 border-stone-700 p-5">
        <div className="text-sm text-stone-700 mb-4">Based on your survey, these accommodations are active. Retake the survey to update.</div>
        <div className="grid grid-cols-2 gap-3 mb-5">
          {profile?.hasADHD && <Tag>ADHD-friendly</Tag>}
          {profile?.hasDyslexia && <Tag>Dyslexia support</Tag>}
          {profile?.hasAnxiety && <Tag>Low-pressure</Tag>}
          {profile?.hasSensory && <Tag>Reduced motion</Tag>}
          {!profile?.hasADHD && !profile?.hasDyslexia && !profile?.hasAnxiety && !profile?.hasSensory && (
            <div className="col-span-2 text-stone-600 italic text-sm">No accommodations active.</div>
          )}
        </div>
        <button onClick={onReset} className="text-sm text-red-800 hover:text-red-900 underline italic">Retake the survey</button>
      </div>
    </div>
  );
}

function Row({ l, icon: I, children }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <I className="w-5 h-5 text-stone-700" strokeWidth={1.5} />
        <div className="font-bold text-stone-900">{l}</div>
      </div>
      {children}
    </div>
  );
}

function Toggle({ v, onChange }) {
  return (
    <button onClick={() => onChange(!v)} className={`w-14 h-7 border-2 border-stone-900 relative ${v ? 'bg-red-700' : 'bg-amber-100'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-amber-50 border border-stone-900 transition-all ${v ? 'left-7' : 'left-0.5'}`} />
    </button>
  );
}

function Tag({ children }) {
  return <div className="px-3 py-2 bg-red-700 text-amber-50 text-xs tracking-widest uppercase font-bold text-center" style={{ fontFamily: '"Futura", sans-serif' }}>✓ {children}</div>;
}

// ============== LESSON ==============
function Lesson({ topic, profile, progress, setProgress, onExit, onDone, prefs }) {
  const content = getLessonContent(topic.id, profile, topic);
  const chunks = content.chunks;
  const total = chunks.length;
  const cur = chunks[progress];
  const done = progress >= total;

  useEffect(() => { if (done) onDone(); }, [done]);

  const fs = prefs.fontSize === 'large' ? 'text-xl leading-loose' : 'text-lg leading-relaxed';

  if (done) {
    return (
      <div className="max-w-xl mx-auto text-center mt-12">
        <div className="inline-block mb-6"><Burst /></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-700 text-amber-50 text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: '"Futura", sans-serif' }}>
          <Star className="w-3 h-3 fill-amber-50" /> The End
        </div>
        <h3 className="text-5xl font-black text-stone-900 mb-4" style={{ textShadow: '3px 3px 0 #d97706' }}>That's a <em className="italic text-red-800">wrap.</em></h3>
        <p className="text-stone-700 mb-8 text-lg">{profile?.hasAnxiety ? "Nicely done. You moved at your own pace — that's what matters." : "You worked through every section. Great focus."}</p>
        <button onClick={onExit} className="bg-stone-900 text-amber-50 px-7 py-4 hover:bg-red-800 inline-flex items-center gap-2 tracking-widest uppercase text-sm shadow-[6px_6px_0_rgba(180,83,9,0.8)]" style={{ fontFamily: '"Futura", sans-serif' }}>
          Back to Lessons <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="text-sm text-stone-700 hover:text-stone-900 font-bold tracking-widest uppercase flex items-center gap-2" style={{ fontFamily: '"Futura", sans-serif' }}>
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <div className="text-xs tracking-[0.3em] uppercase text-stone-700 font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>{progress + 1} / {total}</div>
      </div>

      {prefs.showProgress && (
        <div className="mb-8">
          <div className="h-2 bg-amber-100 border-2 border-stone-900 overflow-hidden">
            <div className="h-full bg-red-700 transition-all duration-500" style={{ width: `${((progress + 1) / total) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="text-3xl mb-2">{topic.emoji}</div>
        <h3 className="text-sm uppercase tracking-widest text-red-800 font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>{topic.title}</h3>
      </div>

      <div className="bg-amber-50/80 border-4 border-stone-900 p-6 md:p-8 mb-6 shadow-[8px_8px_0_rgba(180,83,9,0.6)]" key={progress}>
        {cur.heading && <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-5 leading-tight">{cur.heading}</h2>}
        {cur.type === 'text' && <p className={`text-stone-800 ${fs}`}>{cur.body}</p>}
        {cur.type === 'interactive' && <Interactive c={cur} fs={fs} />}
        {cur.type === 'check' && <CheckQ c={cur} profile={profile} fs={fs} />}
      </div>

      <button onClick={() => setProgress(progress + 1)}
        className="inline-flex items-center gap-3 bg-stone-900 text-amber-50 px-8 py-4 hover:bg-red-800 tracking-widest uppercase text-sm shadow-[6px_6px_0_rgba(180,83,9,0.8)] hover:shadow-[3px_3px_0_rgba(180,83,9,0.8)] hover:translate-x-[3px] hover:translate-y-[3px]"
        style={{ fontFamily: '"Futura", sans-serif' }}>
        {progress === total - 1 ? 'Finish Lesson' : 'Continue'} <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function Interactive({ c, fs }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <p className={`text-stone-800 mb-6 ${fs}`}>{c.body}</p>
      <div className="p-6 bg-stone-900 text-amber-50 border-2 border-red-700">
        <div className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-3 flex items-center gap-2 font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>
          <Lightbulb className="w-4 h-4" /> Your Turn
        </div>
        <div className="text-lg mb-5">{c.prompt}</div>
        {!show ? (
          <button onClick={() => setShow(true)} className="border-2 border-amber-300 text-amber-300 px-5 py-2 hover:bg-amber-300 hover:text-stone-900 tracking-widest uppercase text-sm" style={{ fontFamily: '"Futura", sans-serif' }}>
            Reveal Answer
          </button>
        ) : <div className="border-t-2 border-amber-900 pt-4">{c.answer}</div>}
      </div>
    </div>
  );
}

function CheckQ({ c, profile, fs }) {
  const [sel, setSel] = useState(null);
  return (
    <div>
      <h3 className="text-2xl font-bold text-stone-900 mb-5">{c.question}</h3>
      {profile?.gentleFeedback && <p className="text-sm text-stone-600 italic mb-5">No pressure — this is just to help things stick.</p>}
      <div className="space-y-3">
        {c.options.map((o, i) => {
          const on = sel === i, right = i === c.correct, showR = sel !== null;
          let cls = 'border-stone-700 bg-amber-100/60 hover:bg-amber-200/80';
          if (showR && right) cls = 'border-green-700 bg-green-100';
          else if (showR && on && !right) cls = 'border-red-700 bg-red-100';
          return (
            <button key={i} onClick={() => sel === null && setSel(i)} disabled={sel !== null}
              className={`w-full text-left p-4 border-2 ${cls}`}>
              <div className="flex items-center justify-between">
                <span className="text-stone-800">{o}</span>
                {showR && right && <Check className="w-5 h-5 text-green-700" strokeWidth={2.5} />}
              </div>
            </button>
          );
        })}
      </div>
      {sel !== null && <div className="mt-5 p-4 bg-stone-900 text-amber-50 text-sm leading-relaxed border-2 border-red-700">{sel === c.correct ? '★ ' : ''}{c.explanation}</div>}
    </div>
  );
}

// ============== ONBOARDING SCREENS ==============
function Splash({ onGo, bg }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden" style={{ ...bg, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
      <div className="absolute top-12 left-12 text-orange-500 opacity-60"><Burst /></div>
      <div className="absolute bottom-16 right-12 text-red-500 opacity-60"><Burst /></div>
      <div className="absolute top-1/3 right-20"><Star className="w-4 h-4 text-amber-700 fill-amber-700" /></div>
      <div className="absolute bottom-1/3 left-16"><Star className="w-3 h-3 text-red-600 fill-red-600" /></div>

      <div className="max-w-3xl w-full text-center relative z-10">
        <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 bg-red-700 text-amber-50 tracking-[0.4em] text-xs uppercase shadow-lg" style={{ fontFamily: '"Futura", sans-serif' }}>
          <Film className="w-3 h-3" /> Now Presenting <Film className="w-3 h-3" />
        </div>

        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 flex items-center justify-center -z-0"><BigBurst /></div>
          <h1 className="relative text-7xl md:text-9xl font-black text-stone-900 tracking-tight leading-none px-8" style={{ textShadow: '4px 4px 0 #d97706, 8px 8px 0 #b91c1c', letterSpacing: '-0.04em' }}>
            MAXI<em className="italic">mize</em>
          </h1>
        </div>

        <div className="my-8 flex items-center justify-center gap-4">
          <div className="h-[2px] w-16 bg-stone-900" />
          <div className="text-stone-900 tracking-[0.5em] text-sm uppercase font-semibold" style={{ fontFamily: '"Futura", sans-serif' }}>A Learning Picture</div>
          <div className="h-[2px] w-16 bg-stone-900" />
        </div>

        <p className="text-xl md:text-2xl text-stone-800 max-w-xl mx-auto leading-relaxed mb-10 italic">
          "The personal learning companion built for minds that move differently."
        </p>

        <button onClick={onGo}
          className="group inline-flex items-center gap-3 bg-stone-900 text-amber-50 px-8 py-4 hover:bg-red-800 text-base tracking-widest uppercase shadow-[6px_6px_0_rgba(180,83,9,0.8)] hover:shadow-[3px_3px_0_rgba(180,83,9,0.8)] hover:translate-x-[3px] hover:translate-y-[3px]"
          style={{ fontFamily: '"Futura", sans-serif' }}>
          Begin the Show <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="mt-16 text-xs tracking-[0.3em] uppercase text-stone-700" style={{ fontFamily: '"Futura", sans-serif' }}>
          ★ Adaptive Lessons ★ Smart Reader ★ Classroom Integration ★
        </div>
      </div>
    </div>
  );
}

function Founder({ onGo, bg }) {
  return (
    <div className="min-h-screen w-full p-6 relative overflow-hidden" style={{ ...bg, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
      <div className="absolute top-8 right-8 opacity-40"><Burst /></div>
      <div className="max-w-3xl mx-auto pt-8 pb-12 relative z-10">
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1 bg-stone-900 text-amber-100 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: '"Futura", sans-serif' }}>
          <Star className="w-3 h-3 fill-amber-100" /> The Founder
        </div>

        <h2 className="text-6xl md:text-7xl font-black text-stone-900 mb-3 leading-none" style={{ textShadow: '3px 3px 0 #d97706' }}>
          Meet <em className="italic text-red-800">Ben.</em>
        </h2>

        <div className="text-sm tracking-[0.3em] uppercase text-stone-700 mb-10" style={{ fontFamily: '"Futura", sans-serif' }}>
          Founder · Junior at Wake Forest
        </div>

        <div className="bg-amber-50/80 border-4 border-stone-900 p-8 mb-8 shadow-[8px_8px_0_rgba(180,83,9,0.6)]">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 bg-red-700 text-amber-50 flex items-center justify-center text-3xl font-black shrink-0">BV</div>
            <div>
              <div className="text-2xl font-bold text-stone-900">Ben Valentino</div>
              <div className="text-stone-700 italic">Wake Forest University, Class of '28</div>
            </div>
          </div>

          <div className="space-y-5 text-stone-800 text-lg leading-relaxed">
            <p>Hi — I'm Ben. I'm a junior at Wake Forest, and like a lot of students, I have <strong className="text-red-800">ADHD</strong>. Staying on task has never been my strong suit. I'd open a textbook, read the same paragraph four times, and still walk away with nothing.</p>
            <p>I kept asking myself: <em>why is every class taught the exact same way, when no two students learn the same?</em></p>
            <p>That question turned into <strong className="text-red-800">Maximize.</strong> A personal AI study partner that meets you where you are — figures out how your brain works, learns your actual coursework, and turns it into something you can actually focus on. Built by someone who needed it first.</p>
          </div>
        </div>

        <div className="text-center italic text-stone-700 text-lg mb-8">
          "Learning shouldn't be one-size-fits-all. Let's fix that."
          <div className="text-sm not-italic mt-2 tracking-wider uppercase">— Ben Valentino</div>
        </div>

        <button onClick={onGo}
          className="group inline-flex items-center gap-3 bg-stone-900 text-amber-50 px-8 py-4 hover:bg-red-800 tracking-widest uppercase shadow-[6px_6px_0_rgba(180,83,9,0.8)] hover:shadow-[3px_3px_0_rgba(180,83,9,0.8)] hover:translate-x-[3px] hover:translate-y-[3px]"
          style={{ fontFamily: '"Futura", sans-serif' }}>
          Start My Survey <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function Survey({ q, idx, total, ans, onAns, onNext, bg }) {
  const I = q.icon;
  const cur = ans[q.id];
  const can = q.multi && cur && cur.length > 0;

  return (
    <div className="min-h-screen w-full p-6 relative" style={{ ...bg, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-700 text-amber-50 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: '"Futura", sans-serif' }}>
            <Star className="w-3 h-3 fill-amber-50" /> Act One: The Survey <Star className="w-3 h-3 fill-amber-50" />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-12 justify-center">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`w-12 h-8 border-2 border-stone-900 flex items-center justify-center text-xs font-bold ${
              i < idx ? 'bg-red-700 text-amber-50' : i === idx ? 'bg-amber-400 text-stone-900' : 'bg-amber-50/50 text-stone-400'
            }`} style={{ fontFamily: '"Futura", sans-serif' }}>{i + 1}</div>
          ))}
        </div>

        <div className="bg-amber-50/80 border-4 border-stone-900 p-8 shadow-[8px_8px_0_rgba(180,83,9,0.6)]">
          <div className="mb-2 text-xs tracking-[0.3em] uppercase text-red-800 font-bold" style={{ fontFamily: '"Futura", sans-serif' }}>
            Scene {idx + 1} of {total}
          </div>
          <div className="flex items-start gap-4 mb-8">
            <I className="w-10 h-10 text-red-800 mt-1 shrink-0" strokeWidth={1.5} />
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">{q.q}</h2>
          </div>

          <div className="space-y-3">
            {q.opts.map(o => {
              const OI = o.icon;
              const on = q.multi ? (cur || []).includes(o.v) : cur === o.v;
              return (
                <button key={o.v} onClick={() => onAns(q.id, o.v, q.multi)}
                  className={`w-full text-left p-5 border-[2.5px] transition-all flex items-center gap-4 ${
                    on ? 'border-stone-900 bg-red-700 text-amber-50 shadow-[4px_4px_0_rgba(0,0,0,0.4)]'
                    : 'border-stone-700 bg-amber-100/60 text-stone-800 hover:bg-amber-200/80 hover:translate-x-1'}`}>
                  {OI && <OI className="w-5 h-5 shrink-0" strokeWidth={1.5} />}
                  <span className="text-base flex-1">{o.l}</span>
                  {on && <Check className="w-5 h-5 shrink-0" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>

          {q.multi && (
            <div className="mt-8 flex justify-end">
              <button onClick={onNext} disabled={!can}
                className={`inline-flex items-center gap-2 px-6 py-3 tracking-widest uppercase text-sm ${
                  can ? 'bg-stone-900 text-amber-50 hover:bg-red-800 shadow-[4px_4px_0_rgba(180,83,9,0.6)]' : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
                style={{ fontFamily: '"Futura", sans-serif' }}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({ profile, onGo, onReset, bg }) {
  const acc = [];
  if (profile.hasADHD) acc.push({ l: 'Shorter lesson chunks', d: 'Bite-sized to match your focus rhythm' });
  if (profile.breakReminders) acc.push({ l: 'Built-in break reminders', d: 'Gentle nudges before fatigue' });
  if (profile.hasDyslexia) acc.push({ l: 'Dyslexia-friendly text', d: 'Larger spacing, readable font' });
  if (profile.hasAnxiety) acc.push({ l: 'No high-pressure quizzes', d: 'Practice without grades' });
  if (profile.hasSensory) acc.push({ l: 'Calmer visuals', d: 'Reduced motion throughout' });

  const ml = { visual: 'Visual learner', auditory: 'Auditory learner', kinesthetic: 'Hands-on learner', reading: 'Reading/writing learner' }[profile.modality];

  return (
    <div className="min-h-screen w-full p-6 relative" style={{ ...bg, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
      <div className="max-w-3xl mx-auto pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-700 text-amber-50 text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: '"Futura", sans-serif' }}>
          <Star className="w-3 h-3 fill-amber-50" /> Your Starring Role
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-stone-900 mb-3 leading-none" style={{ textShadow: '3px 3px 0 #d97706' }}>
          Here's the <em className="italic text-red-800">script.</em>
        </h2>
        <p className="text-stone-800 mb-10 text-lg">
          You're a <strong className="text-red-800">{ml}</strong> at a <strong className="text-red-800">{profile.pace}</strong> pace.
        </p>

        <div className="space-y-3 mb-10">
          {acc.length > 0 ? acc.map((a, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-amber-50/80 border-2 border-stone-900 shadow-[4px_4px_0_rgba(180,83,9,0.5)]">
              <div className="w-8 h-8 bg-red-700 text-amber-50 flex items-center justify-center shrink-0"><Check className="w-5 h-5" strokeWidth={2.5} /></div>
              <div>
                <div className="font-bold text-stone-900 text-lg">{a.l}</div>
                <div className="text-sm text-stone-700 mt-1">{a.d}</div>
              </div>
            </div>
          )) : <div className="p-5 bg-amber-50/80 border-2 border-stone-900"><div className="text-stone-700">A steady, well-paced experience tuned to how you learn.</div></div>}
        </div>

        <button onClick={onGo}
          className="group inline-flex items-center gap-3 bg-stone-900 text-amber-50 px-8 py-4 hover:bg-red-800 tracking-widest uppercase shadow-[6px_6px_0_rgba(180,83,9,0.8)] hover:shadow-[3px_3px_0_rgba(180,83,9,0.8)] hover:translate-x-[3px] hover:translate-y-[3px]"
          style={{ fontFamily: '"Futura", sans-serif' }}>
          Connect My Classes <ChevronRight className="w-5 h-5" />
        </button>
        <button onClick={onReset} className="ml-4 text-sm text-stone-600 hover:text-stone-900 underline italic">Retake survey</button>
      </div>
    </div>
  );
}

function Classroom({ classes, setClasses, profile, onGo, bg }) {
  const [show, setShow] = useState(false);
  const [nc, setNc] = useState({ name: '', platform: '', url: '', files: [] });
  const ps = [
    { id: 'canvas', n: 'Canvas', c: '#dc2626' },
    { id: 'blackboard', n: 'Blackboard', c: '#1f2937' },
    { id: 'google', n: 'Google Classroom', c: '#0369a1' },
    { id: 'moodle', n: 'Moodle', c: '#ea580c' },
    { id: 'schoology', n: 'Schoology', c: '#0891b2' },
    { id: 'other', n: 'Other', c: '#78350f' },
  ];
  const upload = (e) => setNc({ ...nc, files: [...nc.files, ...Array.from(e.target.files || []).map(f => ({ name: f.name }))] });
  const add = () => { if (nc.name && nc.platform) { setClasses([...classes, { ...nc, id: Date.now() }]); setNc({ name: '', platform: '', url: '', files: [] }); setShow(false); } };

  return (
    <div className="min-h-screen w-full p-6 relative" style={{ ...bg, fontFamily: '"Bodoni Moda", Georgia, serif' }}>
      <div className="max-w-3xl mx-auto pt-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-700 text-amber-50 text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: '"Futura", sans-serif' }}>
          <GraduationCap className="w-3 h-3" /> The Production Materials
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-stone-900 mb-3 leading-none" style={{ textShadow: '3px 3px 0 #d97706' }}>
          Bring in your <em className="italic text-red-800">classes.</em>
        </h2>
        <p className="text-stone-800 mb-10 text-lg max-w-2xl">Link portals and upload syllabi. Add more anytime from the Library tab.</p>

        {classes.length > 0 && (
          <div className="space-y-3 mb-6">
            {classes.map(c => {
              const p = ps.find(x => x.id === c.platform);
              return (
                <div key={c.id} className="bg-amber-50/80 border-2 border-stone-900 p-5 shadow-[4px_4px_0_rgba(180,83,9,0.5)] flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center text-amber-50 font-bold" style={{ backgroundColor: p?.c }}>{c.name.charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <div className="font-bold text-stone-900 text-lg">{c.name}</div>
                    <div className="text-sm text-stone-600">{p?.n}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {show ? (
          <div className="bg-amber-50/80 border-4 border-stone-900 p-6 mb-6 shadow-[6px_6px_0_rgba(180,83,9,0.6)]">
            <div className="flex items-center justify-between mb-5">
              <div className="font-bold text-stone-900 text-xl">New Class</div>
              <button onClick={() => setShow(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input value={nc.name} onChange={e => setNc({ ...nc, name: e.target.value })} placeholder="Class name"
                className="w-full p-3 border-2 border-stone-700 bg-amber-100/60 focus:outline-none focus:border-red-700" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ps.map(p => (
                  <button key={p.id} onClick={() => setNc({ ...nc, platform: p.id })}
                    className={`p-3 border-2 text-sm ${nc.platform === p.id ? 'border-stone-900 bg-stone-900 text-amber-50' : 'border-stone-400 bg-amber-100/40 hover:border-stone-700'}`}>{p.n}</button>
                ))}
              </div>
              <label className="block w-full p-5 border-2 border-dashed border-stone-700 bg-amber-100/40 text-center cursor-pointer">
                <Upload className="w-6 h-6 mx-auto mb-2 text-stone-700" strokeWidth={1.5} />
                <div className="text-sm text-stone-700">Upload syllabi or notes</div>
                <input type="file" multiple onChange={upload} className="hidden" />
              </label>
              {nc.files.length > 0 && nc.files.map((f, i) => <div key={i} className="text-xs text-stone-700 flex items-center gap-2"><FileText className="w-3 h-3" /> {f.name}</div>)}
              <button onClick={add} disabled={!nc.name || !nc.platform}
                className={`w-full p-3 tracking-widest uppercase text-sm ${nc.name && nc.platform ? 'bg-stone-900 text-amber-50 hover:bg-red-800' : 'bg-stone-300 text-stone-500'}`}
                style={{ fontFamily: '"Futura", sans-serif' }}>Save Class</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShow(true)} className="w-full p-6 border-4 border-dashed border-stone-700 bg-amber-50/40 hover:bg-amber-100/60 mb-6">
            <Plus className="w-8 h-8 mx-auto mb-2 text-stone-700" strokeWidth={2} />
            <div className="text-stone-800 font-bold tracking-widest uppercase text-sm" style={{ fontFamily: '"Futura", sans-serif' }}>
              {classes.length === 0 ? 'Add Your First Class' : 'Add Another'}
            </div>
          </button>
        )}

        <div className="mt-8">
          <button onClick={onGo}
            className="inline-flex items-center gap-3 bg-stone-900 text-amber-50 px-8 py-4 hover:bg-red-800 tracking-widest uppercase shadow-[6px_6px_0_rgba(180,83,9,0.8)] hover:shadow-[3px_3px_0_rgba(180,83,9,0.8)] hover:translate-x-[3px] hover:translate-y-[3px]"
            style={{ fontFamily: '"Futura", sans-serif' }}>
            {classes.length > 0 ? "Let's Go" : 'Skip for Now'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============== SVG DECORATIONS ==============
function BigBurst() {
  return (
    <svg width="500" height="500" viewBox="0 0 500 500" className="opacity-25">
      {[...Array(24)].map((_, i) => {
        const a = (i * 15) * Math.PI / 180;
        return <line key={i} x1={250 + Math.cos(a) * 80} y1={250 + Math.sin(a) * 80} x2={250 + Math.cos(a) * 230} y2={250 + Math.sin(a) * 230} stroke={i % 2 === 0 ? '#d97706' : '#b91c1c'} strokeWidth={i % 2 === 0 ? 6 : 4} />;
      })}
      <circle cx="250" cy="250" r="75" fill="#fbbf24" opacity="0.4" />
    </svg>
  );
}

function Burst() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      {[...Array(12)].map((_, i) => {
        const a = (i * 30) * Math.PI / 180;
        return <line key={i} x1={40 + Math.cos(a) * 15} y1={40 + Math.sin(a) * 15} x2={40 + Math.cos(a) * 35} y2={40 + Math.sin(a) * 35} stroke="currentColor" strokeWidth="2.5" />;
      })}
      <circle cx="40" cy="40" r="12" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

// ============== LESSON CONTENT (inlined) ==============
const allTopics = [
  { id: 'photosynthesis', title: 'How Photosynthesis Works', emoji: '🌿', source: 'Biology' },
  { id: 'cell-division', title: 'How Cells Divide (Mitosis)', emoji: '🧬', source: 'Biology' },
  { id: 'electricity', title: 'How Electricity Flows', emoji: '⚡', source: 'Physics' },
  { id: 'newtons-laws', title: "Newton's Three Laws of Motion", emoji: '🍎', source: 'Physics' },
  { id: 'fractions', title: 'Understanding Fractions', emoji: '½', source: 'Math' },
  { id: 'algebra-intro', title: 'Intro to Algebraic Thinking', emoji: '𝑥', source: 'Math' },
  { id: 'storytelling', title: 'The Art of Storytelling', emoji: '📖', source: 'Writing' },
  { id: 'wwii-causes', title: 'Causes of World War II', emoji: '🗺️', source: 'History' },
  { id: 'french-revolution', title: 'The French Revolution', emoji: '⚔️', source: 'History' },
  { id: 'supply-demand', title: 'Supply & Demand Basics', emoji: '📊', source: 'Economics' },
];

function getLessonContent(topicId, profile, topic) {
  if (topic?.isCustom) {
    return { chunks: [
      { type: 'text', heading: `Welcome: ${topic.title}`, body: `Maximize generated this lesson based on your request. In production, this would pull real source material and structure it around your ${profile.modality} learning style at a ${profile.pace} pace.` },
      { type: 'text', heading: 'Your spec', body: topic.description || 'A personalized lesson on this topic.' },
      { type: 'interactive', body: `You chose a "${topic.style}" style.`, prompt: 'What\'s the first thing you want to understand?',
        answer: 'Whatever you said — that\'s where Maximize would begin. Custom lessons follow your curiosity.' },
      { type: 'check', question: 'What\'s the value of custom lessons?',
        options: ['Less data', 'Fits exactly what you need', 'Pre-made', 'Replaces a teacher'],
        correct: 1, explanation: 'Exactly. Custom lessons match your needs in real time.' },
    ]};
  }
  if (topic?.fromClass) {
    return { chunks: [
      { type: 'text', heading: `Welcome to ${topic.source}`, body: `Maximize pulled in materials from your ${topic.source} class.` },
      { type: 'text', heading: 'Today\'s focus', body: 'In production, Maximize would scan your syllabus to pinpoint what to review.' },
      { type: 'interactive', body: 'Personalized lessons combine your style with your coursework.',
        prompt: 'What would help you most right now?',
        answer: 'Whatever you said — that\'s the input Maximize uses.' },
      { type: 'check', question: 'What makes Maximize different?',
        options: ['Only videos', 'Adapts to how AND what you learn', 'Replaces professor', 'Grades work'],
        correct: 1, explanation: 'Both pieces matter.' },
    ]};
  }

  const lessons = {
    photosynthesis: { chunks: [
      { type: 'text', heading: 'Plants eat sunlight.', body: "Plants don't eat food like we do. They make their own — from light, water, and air." },
      { type: 'text', heading: 'The three ingredients', body: 'A leaf takes in sunlight, water through its roots, and CO₂ from the air. Chloroplasts inside catch the light using chlorophyll.' },
      { type: 'interactive', body: "The plant combines water and CO₂ using light's energy. Two things come out.",
        prompt: 'What does a plant release as a "waste product"?',
        answer: 'Oxygen! Plants release the oxygen we breathe. The other output is sugar (glucose) — the plant\'s food.' },
      { type: 'check', question: 'Which is NOT needed for photosynthesis?',
        options: ['Sunlight', 'Water', 'Soil minerals', 'CO₂'], correct: 2,
        explanation: 'Plants use minerals for growth, but photosynthesis itself only needs light, water, and CO₂.' },
      { type: 'text', heading: 'Why this matters', body: "Almost all life on Earth depends on this process. The oxygen you're breathing came from a plant." },
    ]},
    fractions: { chunks: [
      { type: 'text', heading: 'A fraction is a part of a whole.', body: 'Cut a pizza into 4 equal slices. Take 1. You have ¼.' },
      { type: 'text', heading: 'Top and bottom', body: 'The bottom (denominator) is how many equal pieces. The top (numerator) is how many you have.' },
      { type: 'interactive', body: 'A chocolate bar has 8 squares.', prompt: 'If you eat 3, what fraction did you eat?',
        answer: '3/8 — three out of eight equal parts.' },
      { type: 'check', question: 'Which equals ½?',
        options: ['2/3', '3/6', '4/5', '1/4'], correct: 1,
        explanation: '3/6 is exactly half. Multiply top and bottom by the same number for equivalents.' },
    ]},
    storytelling: { chunks: [
      { type: 'text', heading: 'Every story has a shape.', body: 'A character wants something. Something gets in the way. They struggle. Something changes.' },
      { type: 'text', heading: 'Begin with want.', body: 'Without desire, there is no story. A character who wants nothing has nothing to chase.' },
      { type: 'interactive', body: 'Think of your favorite movie.',
        prompt: 'What did the main character want? What got in the way?',
        answer: "If you can name both, you've found the engine of the story." },
      { type: 'check', question: 'What makes a character compelling?',
        options: ['A cool name', 'Specific desires and obstacles', 'Detailed backstory', 'Magical powers'],
        correct: 1, explanation: 'Desire creates stakes; obstacles create struggle.' },
    ]},
    electricity: { chunks: [
      { type: 'text', heading: 'Electricity is moving charge.', body: 'Electrons move through conductors. When many flow the same direction, that flow is electricity.' },
      { type: 'text', heading: 'A circuit', body: 'Electrons need a complete loop: battery → wires → device → back. Break the loop, flow stops.' },
      { type: 'text', heading: 'Voltage vs. current', body: 'Voltage is the push. Current is the flow. Like water — voltage is pressure, current is flow rate.' },
      { type: 'interactive', body: 'A flashlight has battery, wires, and bulb.',
        prompt: 'What if you remove the battery?',
        answer: 'The loop breaks — no push, no flow. Bulb goes dark.' },
      { type: 'check', question: 'What does a switch do?',
        options: ['Adds energy', 'Opens/closes the loop', 'Changes voltage', 'Cools wires'],
        correct: 1, explanation: 'A switch is a controlled break in the wire.' },
    ]},
    'supply-demand': { chunks: [
      { type: 'text', heading: 'Two forces set prices.', body: 'In any market, prices come from how much people want something (demand) and how much exists (supply).' },
      { type: 'text', heading: 'How it works', body: 'High demand + low supply = prices rise. Low demand + high supply = prices fall. Concert tickets, sneakers, gas — all follow this.' },
      { type: 'interactive', body: 'Imagine only 10 pizzas will be made tomorrow.',
        prompt: 'What happens to the price?',
        answer: 'It goes up. Limited supply + steady demand = higher price.' },
      { type: 'check', question: 'A new console sells out instantly. What\'s likely?',
        options: ['Prices drop', 'Resellers charge more', 'Store stops selling', 'Nothing'],
        correct: 1, explanation: 'High demand + low supply = price increase.' },
      { type: 'text', heading: 'Equilibrium', body: 'The price where supply meets demand is equilibrium. Markets fluctuate around it.' },
    ]},
    'cell-division': { chunks: [
      { type: 'text', heading: 'One cell becomes two.', body: 'Mitosis is how your body grows, heals cuts, and replaces dead cells. One cell divides into two identical copies.' },
      { type: 'text', heading: 'Why we need it', body: 'You started as one cell. You\'re now trillions. Every one came from mitosis.' },
      { type: 'text', heading: 'Four phases', body: 'Prophase, metaphase, anaphase, telophase. Chromosomes condense, line up, split, and end up in two new cells.' },
      { type: 'interactive', body: 'Each daughter cell needs complete DNA.',
        prompt: 'What if the DNA doesn\'t split evenly?',
        answer: 'One cell has extra, one has too few. This causes some genetic disorders (like Down syndrome) and many cancers.' },
      { type: 'check', question: 'What\'s the main purpose of mitosis?',
        options: ['Making sperm/eggs', 'Growth and repair', 'Digesting food', 'Sensing'],
        correct: 1, explanation: 'Mitosis = growth/repair. Meiosis makes sperm and eggs.' },
    ]},
    'wwii-causes': { chunks: [
      { type: 'text', heading: 'Wars don\'t come from nowhere.', body: 'WWII started in 1939, but the seeds were planted decades earlier.' },
      { type: 'text', heading: 'Treaty of Versailles', body: 'After WWI, Germany faced harsh terms — payments, lost territory, tiny military. This humiliation created deep resentment.' },
      { type: 'text', heading: 'The Great Depression', body: 'The 1929 crash sparked global collapse. Desperate populations were drawn to leaders promising radical change.' },
      { type: 'text', heading: 'Rise of dictators', body: 'Hitler, Mussolini, Japanese militarists — all rose by exploiting economic suffering and wounded national pride.' },
      { type: 'interactive', body: 'European powers tried appeasing Hitler in the 1930s.',
        prompt: 'Why might appeasement have made things worse?',
        answer: 'Each concession convinced Hitler the major powers wouldn\'t fight back. By 1939, he had absorbed Austria and Czechoslovakia.' },
      { type: 'check', question: 'Which was NOT a major cause of WWII?',
        options: ['Versailles', 'Great Depression', 'Fall of Rome', 'Fascism'],
        correct: 2, explanation: 'Rome fell 1,500 years earlier. The other three are the standard causes.' },
    ]},
    'algebra-intro': { chunks: [
      { type: 'text', heading: 'Algebra is about unknowns.', body: 'Regular math: 2 + 3 = 5. Algebra: 2 + x = 5. The "x" is a number we don\'t know yet — our job is to find it.' },
      { type: 'text', heading: 'Why letters?', body: 'Because we can describe patterns without specific numbers. "Your age plus 5" = x + 5, for any x.' },
      { type: 'interactive', body: 'You have apples. You buy 4 more. Now you have 11.',
        prompt: 'How many did you start with?',
        answer: 'You started with 7. Equation: x + 4 = 11. Subtract 4 from both sides: x = 7.' },
      { type: 'text', heading: 'The golden rule', body: 'Whatever you do to one side, do to the other. This keeps the equation balanced.' },
      { type: 'check', question: 'Solve x + 7 = 15.',
        options: ['7', '8', '15', '22'], correct: 1,
        explanation: 'Subtract 7 from both sides: x = 8.' },
    ]},
    'french-revolution': { chunks: [
      { type: 'text', heading: 'A nation explodes.', body: 'In 1789, France\'s rigid social order collapsed in just months. Within five years, the king was executed and Europe was at war.' },
      { type: 'text', heading: 'The three estates', body: 'France was divided: clergy (1st), nobility (2nd), and everyone else (3rd) — 97% of the population — who paid almost all the taxes.' },
      { type: 'text', heading: 'The spark', body: 'A bankrupt government, failed harvests, and Enlightenment ideas about equality combined. When the king called a meeting, the Third Estate revolted.' },
      { type: 'interactive', body: 'The storming of the Bastille on July 14, 1789 became the symbol of revolution.',
        prompt: 'Why did a prison become the symbol?',
        answer: 'The Bastille held political prisoners and stored weapons. Taking it meant the people had power over the king\'s authority — and could arm themselves.' },
      { type: 'check', question: 'What "estate" paid the most taxes?',
        options: ['1st (clergy)', '2nd (nobility)', '3rd (everyone else)', 'They paid equally'],
        correct: 2, explanation: 'The Third Estate — 97% of France — paid almost everything. This inequality fueled the revolution.' },
    ]},
    'newtons-laws': { chunks: [
      { type: 'text', heading: 'Three rules that govern motion.', body: 'In 1687, Isaac Newton wrote three simple laws that explain how everything moves — from baseballs to planets.' },
      { type: 'text', heading: 'First law: inertia', body: 'Objects keep doing what they\'re doing unless something pushes them. A still ball stays still. A moving ball keeps moving until friction or another force stops it.' },
      { type: 'text', heading: 'Second law: F = ma', body: 'The force you need equals mass times acceleration. Pushing a shopping cart? Easy. Pushing a car? Hard. Same idea, different mass.' },
      { type: 'text', heading: 'Third law: action/reaction', body: 'Every action has an equal and opposite reaction. You push the ground — the ground pushes you back. That\'s how walking works.' },
      { type: 'interactive', body: 'Imagine you\'re on a skateboard and throw a heavy ball forward.',
        prompt: 'What happens to you?',
        answer: 'You roll backward. Third law: you pushed the ball forward, so it pushed you back — equal and opposite.' },
      { type: 'check', question: 'Which is Newton\'s second law?',
        options: ['Objects stay in motion', 'F = ma', 'Equal and opposite reactions', 'E = mc²'],
        correct: 1, explanation: 'F = ma. The first is inertia, the third is action/reaction. E = mc² is Einstein.' },
    ]},
  };

  return lessons[topicId] || lessons.photosynthesis;
}
