import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  MapPin, Phone, Mail, Instagram, Facebook, Search, Calendar, Users, TreePine,
  Sparkles, ShieldCheck, Clock, CheckCircle2, ChevronRight, ChevronDown, Play,
  Star, Quote, MessageCircle, MessageSquare, ArrowRight, Plane, Utensils, Bed,
  ChevronLeft, X, Maximize2, Bird, HelpCircle, Wind, Leaf, Wand2, Loader2,
  Plus, Trash2, Edit3, Type, Heart, Home, Youtube, Twitter, Linkedin, Globe,
  Briefcase, Award, Camera, Music, Coffee,
  type LucideIcon
} from "lucide-react";

// Icon map for dynamic rendering — only includes icons actually used in the app
const lucide: Record<string, LucideIcon> = {
  MapPin, Phone, Mail, Instagram, Facebook, Search, Calendar, Users, TreePine,
  Sparkles, ShieldCheck, Clock, CheckCircle2, ChevronRight, ChevronDown, Play,
  Star, Quote, MessageCircle, MessageSquare, ArrowRight, Plane, Utensils, Bed,
  ChevronLeft, X, Maximize2, Bird, HelpCircle, Wind, Leaf, Wand2, Loader2,
  Plus, Trash2, Edit3, Type, Heart, Home, Youtube, Twitter, Linkedin, Globe,
  Briefcase, Award, Camera, Music, Coffee,
};
import { generateContent } from './services/geminiService';
import { useRef, useEffect, useState } from "react";
import React from "react";

// --- Nature Elements ---

const AdminContext = React.createContext<{ isAdmin: boolean }>({ isAdmin: false });

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div 
        className="custom-cursor hidden md:block"
        animate={{ 
          x: position.x - 10, 
          y: position.y - 10,
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.5 : 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.5 }}
      />
      <motion.div 
        className="custom-cursor-follower hidden md:block"
        animate={{ 
          x: position.x - 20, 
          y: position.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.2 : 0.5
        }}
        transition={{ type: "spring", damping: 40, stiffness: 200, mass: 0.8 }}
      />
    </>
  );
};

// --- CMS Types ---
interface Content {
  topBar: { phone: string; location: string; email: string; socials: { icon: string; url: string }[] };
  navbar: { logo: { text1: string; text2: string }; links: { label: string; href: string }[]; cta: string; ctaHref: string };
  hero: { 
    subtitle: string; 
    title1: string; 
    title2: string; 
    description: string; 
    primaryBtn: string; 
    primaryBtnHref: string;
    secondaryBtn: string; 
    secondaryBtnHref: string;
    bgImage: string;
    bgVideo: string;
    images: string[];
    location: string;
    verticalLabels: string[];
  };
  gallery: { subtitle: string; title: string; bgImage: string; images: string[]; categories: { name: string; images: string[] }[]; cta: string; ctaHref: string };
  boate: { subtitle: string; title: string; description: string; features: string[]; img: string; cta: string; ctaHref: string };
  audiences: { subtitle: string; title: string; items: { title: string; desc: string; icon: string; features: string[]; cta: string; ctaHref: string }[] };
  about: { 
    subtitle: string; 
    title: string; 
    description: string; 
    features: { title: string; desc: string; icon: string }[]; 
    cta: string; 
    ctaHref: string; 
    bgImage: string;
    secondaryImage: string;
    tertiaryImage: string;
    badge: { val: string; label: string };
  };
  lazer: {
    subtitle: string;
    title: string;
    description: string;
    items: { title: string; desc: string; img: string }[];
  };
  suites: {
    subtitle: string;
    title: string;
    description: string;
    cta: string;
    ctaHref: string;
    featured: {
      title: string;
      desc: string;
      img: string;
      amenities: string[];
    };
  };
  monteVerde: {
    subtitle: string;
    title: string;
    items: { title: string; desc: string; img: string; link?: string }[];
  };
  gastronomy: {
    subtitle: string;
    title: string;
    img: string;
    cta: string;
    ctaHref: string;
  };
  stats: { bgImage: string; items: { val: string; label: string }[] };
  testimonials: { subtitle: string; title: string; items: { name: string; date: string; text: string }[] };
  contactSection: {
    subtitle: string;
    title: string;
    form: {
      namePlaceholder: string;
      emailPlaceholder: string;
      phonePlaceholder: string;
      messagePlaceholder: string;
      submitBtn: string;
      recipientEmail: string;
    };
    map: {
      title: string;
      address: string;
      phone: string;
      email: string;
      googleMapsUrl: string;
      embedUrl: string;
      hours: string;
    };
  };
  footer: { 
    logo: { text1: string; text2: string };
    description: string; 
    contact: { title: string; address: string; addressSub: string; phone: string; email: string };
    links: { label: string; href: string }[];
    socials: { icon: string; url: string }[];
    newsletter: { title: string; desc: string; placeholder: string; recipientEmail: string };
    copyright: string;
    privacy: string;
    terms: string;
  };
  whatsapp: { number: string; message: string; label: string; icon: string };
  faq: {
    subtitle: string;
    title: string;
    items: { question: string; answer: string }[];
  };
}

interface EditableProps {
  label?: string;
  children: React.ReactNode;
  onEdit: () => void;
  className?: string;
}

const Editable: React.FC<EditableProps> = ({ 
  children, 
  onEdit, 
  className = "",
  label = ""
}) => {
  const { isAdmin } = React.useContext(AdminContext);
  
  if (!isAdmin) return <>{children}</>;

  return (
    <div 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit();
      }}
      className={`relative group/editable ${className} hover:outline-2 hover:outline-accent/50 hover:outline-dashed transition-all duration-300 cursor-pointer min-h-[1.2em] min-w-[20px]`}
    >
      {children}
      <div className="absolute -top-3 -right-3 z-[9999] opacity-40 group-hover/editable:opacity-100 transition-all duration-300 pointer-events-auto scale-75 group-hover/editable:scale-100">
        <div 
          className="bg-accent text-primary p-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all border-2 border-white flex items-center gap-2 cursor-pointer"
          title={label || "Editar este elemento"}
        >
          <Edit3 size={14} />
          {label && <span className="text-[9px] font-bold uppercase tracking-widest pr-1 whitespace-nowrap">{label}</span>}
        </div>
      </div>
    </div>
  );
};

const GalleryCategoriesEditor = ({
  value,
  setValue,
  handleImageUpload,
  uploading,
  setUploading,
}: {
  value: { name: string; images: string[] }[];
  setValue: (v: any) => void;
  handleImageUpload: (f: File) => Promise<string | null>;
  uploading: boolean;
  setUploading: (v: boolean) => void;
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [renamingIdx, setRenamingIdx] = useState<number | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const allImages = Array.from(new Set(value.flatMap(c => c.images)));

  const addCategory = () => {
    const name = newCatName.trim();
    if (!name) return;
    setValue([...value, { name, images: [] }]);
    setNewCatName('');
  };

  const deleteCategory = (idx: number) => {
    if (!confirm(`Apagar categoria "${value[idx].name}"?`)) return;
    setValue(value.filter((_, i) => i !== idx));
  };

  const renameCategory = (idx: number) => {
    setValue(value.map((c, i) => i === idx ? { ...c, name: renameVal } : c));
    setRenamingIdx(null);
  };

  const deleteImageFromAll = (imgUrl: string) => {
    if (!confirm('Remover esta foto de todas as categorias?')) return;
    setValue(value.map(c => ({ ...c, images: c.images.filter(img => img !== imgUrl) })));
    if (selectedPhoto === imgUrl) setSelectedPhoto(null);
  };

  const toggleImageInCat = (catIdx: number, imgUrl: string) => {
    const inCat = value[catIdx].images.includes(imgUrl);
    setValue(value.map((c, i) =>
      i === catIdx
        ? { ...c, images: inCat ? c.images.filter(img => img !== imgUrl) : [...c.images, imgUrl] }
        : c
    ));
  };

  const addToAll = (imgUrl: string) => {
    setValue(value.map(c => ({ ...c, images: c.images.includes(imgUrl) ? c.images : [...c.images, imgUrl] })));
  };

  const uploadAndAssign = async (files: FileList, targetCats: number[]) => {
    setUploading(true);
    let current = [...value];
    for (let i = 0; i < files.length; i++) {
      const url = await handleImageUpload(files[i]);
      if (url) {
        current = current.map((c, ci) =>
          targetCats.includes(ci) ? { ...c, images: [...c.images, url] } : c
        );
      }
    }
    setValue(current);
    setUploading(false);
  };

  // Upload zone with category selection
  const UploadZone = () => {
    const [selectedCats, setSelectedCats] = useState<number[]>([]);
    const [allCats, setAllCats] = useState(false);

    const toggleCat = (idx: number) => {
      setAllCats(false);
      setSelectedCats(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };
    const toggleAll = () => {
      setAllCats(!allCats);
      setSelectedCats([]);
    };
    const targets = allCats ? value.map((_, i) => i) : selectedCats;

    return (
      <div className="border-2 border-dashed border-accent/30 rounded-2xl p-5 space-y-4 bg-accent/5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Adicionar fotos</p>

        {/* Category selection */}
        <div className="space-y-2">
          <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Adicionar em:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleAll}
              className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all ${allCats ? 'bg-primary text-white border-primary' : 'border-gray-200 text-gray-400 hover:border-accent hover:text-accent'}`}
            >
              Todas
            </button>
            {value.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => toggleCat(idx)}
                className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all ${selectedCats.includes(idx) ? 'bg-accent text-white border-accent' : 'border-gray-200 text-gray-400 hover:border-accent hover:text-accent'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Upload button */}
        <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer ${targets.length > 0 ? 'bg-accent text-white hover:bg-primary' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          {uploading ? 'Enviando...' : targets.length > 0 ? 'Escolher fotos' : 'Selecione ao menos 1 categoria'}
          {targets.length > 0 && <input type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && uploadAndAssign(e.target.files, targets)} />}
        </label>
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* Categories management */}
      <div className="space-y-2">
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Categorias</p>
        {value.map((cat, idx) => (
          <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            {renamingIdx === idx ? (
              <>
                <input autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') renameCategory(idx); if (e.key === 'Escape') setRenamingIdx(null); }}
                  className="flex-1 bg-white border border-accent/30 rounded-lg py-1 px-2 text-xs outline-none" />
                <button onClick={() => renameCategory(idx)} className="text-accent p-1"><CheckCircle2 size={14} /></button>
              </>
            ) : (
              <>
                <span className="flex-1 text-xs font-bold text-primary">{cat.name}</span>
                <span className="text-[9px] text-gray-400">{cat.images.length} fotos</span>
                <button onClick={() => { setRenamingIdx(idx); setRenameVal(cat.name); }} className="text-gray-300 hover:text-accent p-1"><Edit3 size={12} /></button>
                <button onClick={() => deleteCategory(idx)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={12} /></button>
              </>
            )}
          </div>
        ))}
        <div className="flex gap-2">
          <input type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            placeholder="Nova categoria..."
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-xs outline-none focus:ring-2 focus:ring-accent/20" />
          <button onClick={addCategory} className="bg-accent text-white px-3 py-2 rounded-xl hover:bg-primary transition-all"><Plus size={14} /></button>
        </div>
      </div>

      {/* Upload zone */}
      <UploadZone />

      {/* All photos */}
      {allImages.length > 0 && (
        <div className="space-y-3">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Todas as fotos ({allImages.length})</p>
          <div className="grid grid-cols-3 gap-2">
            {allImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <button onClick={() => setSelectedPhoto(selectedPhoto === img ? null : img)} className="w-full">
                  <div className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedPhoto === img ? 'border-accent' : 'border-transparent'}`}>
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </button>
                <button onClick={() => deleteImageFromAll(img)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow">
                  <Trash2 size={8} />
                </button>

                {/* Category assignment when selected */}
                {selectedPhoto === img && (
                  <div className="mt-1 space-y-1">
                    <button onClick={() => addToAll(img)} className="w-full py-1 rounded-lg bg-primary text-white text-[8px] font-bold uppercase tracking-wider">
                      + Todas as categorias
                    </button>
                    {value.map((cat, catIdx) => (
                      <button key={catIdx} onClick={() => toggleImageInCat(catIdx, img)}
                        className={`w-full py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider transition-all ${cat.images.includes(img) ? 'bg-accent text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {cat.images.includes(img) ? '✓ ' : '+ '}{cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[8px] text-gray-400 text-center">Clique em uma foto para gerenciar suas categorias</p>
        </div>
      )}
    </div>
  );
};

const QuickEditSidebar = ({
  field,
  onSave,
  onClose,
  isSaving
}: { 
  field: { path: string, label: string, type: 'text' | 'textarea' | 'image' | 'number' | 'button' | 'icon' | 'gallery' | 'gallery-categories' | 'link' | 'socials' | 'navLinks' | 'logo', value: any },
  onSave: (value: any) => void, 
  onClose: () => void,
  isSaving: boolean
}) => {
  const [value, setValue] = useState(field.value);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setValue(field.value);
  }, [field]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        return data.url;
      }
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
    return null;
  };

  const handleMultiUpload = async (files: FileList) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const url = await handleImageUpload(files[i]);
      if (url) urls.push(url);
    }
    if (field.type === 'gallery') {
      setValue([...value, ...urls]);
    } else {
      setValue(urls[0]);
    }
  };

  const iconList = [
    'MapPin', 'Phone', 'Mail', 'Instagram', 'Facebook', 'Youtube', 'Twitter', 'Linkedin', 
    'Search', 'Calendar', 'Users', 'TreePine', 'Sparkles', 'ShieldCheck', 'Clock', 
    'CheckCircle2', 'ChevronRight', 'Play', 'Star', 'Quote', 'MessageCircle', 
    'ArrowRight', 'Plane', 'Utensils', 'Bed', 'Bird', 'Wind', 'Leaf', 'Wand2', 
    'Heart', 'Camera', 'Music', 'Coffee', 'Globe', 'Briefcase', 'Award', 'Camera'
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col relative z-10 border-l border-white/10"
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-primary text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Wand2 size={10} className="text-accent" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/80">Editor de Conteúdo</h3>
            </div>
            <p className="text-2xl font-serif text-white">{field.label}</p>
          </div>
          <button 
            onClick={onClose} 
            className="relative z-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all duration-500 group"
            title="Fechar Editor"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Editor Field */}
          <div className="space-y-6">
            {field.type === 'logo' ? (
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Texto Principal</label>
                    <input 
                      type="text"
                      value={value.text1}
                      onChange={(e) => setValue({ ...value, text1: e.target.value })}
                      className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Subtexto / Slogan</label>
                    <input 
                      type="text"
                      value={value.text2}
                      onChange={(e) => setValue({ ...value, text2: e.target.value })}
                      className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs outline-none focus:ring-2 focus:ring-accent/20"
                    />
                  </div>
                </div>
              </div>
            ) : field.type === 'socials' ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <Users size={12} className="text-accent" />
                    Gerenciar Redes Sociais ({value.length})
                  </label>
                  <button 
                    onClick={() => setValue([...value, { icon: 'Facebook', url: '#' }])}
                    className="bg-accent text-primary px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform"
                  >
                    Adicionar Rede
                  </button>
                </div>
                
                <div className="space-y-6">
                  {value.map((item: any, idx: number) => (
                    <div key={idx} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4 relative group">
                      <button 
                        onClick={() => setValue(value.filter((_: any, i: number) => i !== idx))}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Ícone</label>
                          <select 
                            value={item.icon}
                            onChange={(e) => {
                              const newList = [...value];
                              newList[idx].icon = e.target.value;
                              setValue(newList);
                            }}
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs outline-none focus:ring-2 focus:ring-accent/20"
                          >
                            {iconList.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">URL</label>
                          <input 
                            type="text"
                            value={item.url}
                            onChange={(e) => {
                              const newList = [...value];
                              newList[idx].url = e.target.value;
                              setValue(newList);
                            }}
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs outline-none focus:ring-2 focus:ring-accent/20"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : field.type === 'navLinks' ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <ArrowRight size={12} className="text-accent" />
                    Links de Navegação ({value.length})
                  </label>
                  <button 
                    onClick={() => setValue([...value, { label: 'Novo Link', href: '#' }])}
                    className="bg-accent text-primary px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform"
                  >
                    Novo Link
                  </button>
                </div>
                
                <div className="space-y-6">
                  {value.map((item: any, idx: number) => (
                    <div key={idx} className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 space-y-4 relative group">
                      <button 
                        onClick={() => setValue(value.filter((_: any, i: number) => i !== idx))}
                        className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 size={12} />
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Rótulo</label>
                          <input 
                            type="text"
                            value={item.label}
                            onChange={(e) => {
                              const newList = [...value];
                              newList[idx].label = e.target.value;
                              setValue(newList);
                            }}
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs outline-none focus:ring-2 focus:ring-accent/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Destino</label>
                          <input 
                            type="text"
                            value={item.href}
                            onChange={(e) => {
                              const newList = [...value];
                              newList[idx].href = e.target.value;
                              setValue(newList);
                            }}
                            className="w-full bg-white border border-gray-100 rounded-xl py-3 px-4 text-xs outline-none focus:ring-2 focus:ring-accent/20"
                            placeholder="#secao ou https://..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : field.type === 'gallery' ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <Maximize2 size={12} className="text-accent" />
                    Gerenciar Galeria ({value.length} fotos)
                  </label>
                  <label className="bg-accent text-primary px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-widest cursor-pointer hover:scale-105 transition-transform">
                    Adicionar Fotos
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => e.target.files && handleMultiUpload(e.target.files)} 
                    />
                  </label>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {value.map((img: string, idx: number) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => setValue(value.filter((_: any, i: number) => i !== idx))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
                    <Plus size={20} className="text-gray-300" />
                    <span className="text-[8px] font-bold uppercase text-gray-300">Novo</span>
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => e.target.files && handleMultiUpload(e.target.files)} 
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <Mail size={12} className="text-accent" />
                    URLs das Imagens (uma por linha)
                  </label>
                  <textarea
                    value={value.join('\n')}
                    onChange={(e) => setValue(e.target.value.split('\n').filter(s => s.trim()))}
                    className="w-full h-40 bg-gray-50 border border-gray-100 p-6 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 text-xs font-mono text-gray-500"
                    placeholder="https://exemplo.com/imagem1.jpg"
                  />
                </div>
              </div>
            ) : field.type === 'gallery-categories' ? (
              <GalleryCategoriesEditor value={value} setValue={setValue} handleImageUpload={handleImageUpload} uploading={uploading} setUploading={setUploading} />
            ) : field.type === 'icon' ? (
              <div className="space-y-6">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                  <Sparkles size={12} className="text-accent" />
                  Selecionar Ícone
                </label>
                <div className="grid grid-cols-5 gap-4">
                  {iconList.map((iconName) => {
                    const IconComp = (lucide as any)[iconName];
                    return (
                      <button
                        key={iconName}
                        onClick={() => setValue(iconName)}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-center ${value === iconName ? 'bg-accent border-accent text-primary' : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-accent/30'}`}
                        title={iconName}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary">
                    {React.createElement((lucide as any)[value] || HelpCircle, { size: 24 })}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">Ícone Selecionado</p>
                    <p className="text-sm font-bold text-primary">{value}</p>
                  </div>
                </div>
              </div>
            ) : field.type === 'image' ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <Maximize2 size={12} className="text-accent" />
                    Prévia da Imagem
                  </label>
                  <div className="relative group rounded-[40px] overflow-hidden aspect-video shadow-2xl border border-gray-100 bg-gray-50">
                    <img src={value} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest">Visualização Atual</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                      <Mail size={12} className="text-accent" />
                      URL da Imagem
                    </label>
                    <input 
                      type="text" 
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 px-6 text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all font-mono text-gray-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold text-gray-300">
                      <span className="bg-white px-6">Ou Upload Local</span>
                    </div>
                  </div>

                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-100 rounded-[40px] cursor-pointer hover:border-accent/40 hover:bg-accent/5 transition-all group relative overflow-hidden">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-white" />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent transition-colors">Arraste ou clique para enviar</p>
                      <p className="text-[8px] text-gray-300 mt-2 uppercase tracking-widest">JPG, PNG ou WEBP (Max 5MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={async (e) => {
                        if (e.target.files?.[0]) {
                          const url = await handleImageUpload(e.target.files[0]);
                          if (url) setValue(url);
                        }
                      }}
                    />
                  </label>
                </div>
                {uploading && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-3 p-4 bg-accent/5 rounded-2xl text-accent border border-accent/10"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Processando imagem...</span>
                  </motion.div>
                )}
              </div>
            ) : field.type === 'link' ? (
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                  <MapPin size={12} className="text-accent" />
                  Destino (Link ou ID)
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 py-6 px-8 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 text-sm text-gray-500 font-mono"
                    placeholder="Ex: #contato ou https://..."
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            ) : field.type === 'textarea' ? (
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                  <Edit3 size={12} className="text-accent" />
                  Conteúdo Detalhado
                </label>
                <div className="relative">
                  <textarea 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full h-80 bg-gray-50 border border-gray-100 p-8 rounded-[40px] outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 text-gray-600 leading-relaxed text-sm resize-none shadow-inner"
                    placeholder="Descreva o conteúdo com elegância..."
                  />
                  <div className="absolute bottom-6 right-8 text-[8px] font-bold uppercase tracking-widest text-gray-300">
                    {value.length} caracteres
                  </div>
                </div>
              </div>
            ) : field.type === 'button' ? (
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <Sparkles size={12} className="text-accent" />
                    Rótulo do Botão
                  </label>
                  <input 
                    type="text"
                    value={value.text}
                    onChange={(e) => setValue({ ...value, text: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 py-5 px-8 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 text-xl text-primary font-serif italic"
                    placeholder="Ex: Saiba Mais"
                  />
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                    <MapPin size={12} className="text-accent" />
                    Destino (Link ou ID)
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={value.link}
                      onChange={(e) => setValue({ ...value, link: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 py-5 px-8 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 text-sm text-gray-500 font-mono"
                      placeholder="Ex: #contato ou https://..."
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                  <Edit3 size={12} className="text-accent" />
                  Título / Texto Curto
                </label>
                <input 
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 py-6 px-8 rounded-2xl outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 text-lg text-primary font-serif font-bold"
                  placeholder="Digite o título..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-4">
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-5 text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <X size={14} />
              Descartar
            </button>
            <button 
              onClick={() => onSave(value)}
              disabled={isSaving || uploading}
              className={`flex-[2] bg-primary text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-3 transform transition-all duration-500 ${isSaving || uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent hover:text-primary hover:-translate-y-1'}`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} className="text-accent group-hover:text-primary" />
                  Publicar Alterações
                </>
              )}
            </button>
          </div>
          <p className="text-[8px] text-center text-gray-300 uppercase tracking-widest">As mudanças serão aplicadas instantaneamente</p>
        </div>
      </motion.div>
    </div>
  );
};

const WhatsAppButton = ({ content, onEdit }: { content: Content['whatsapp'], onEdit?: (type: 'number' | 'message' | 'label' | 'icon') => void }) => {
  const { isAdmin } = React.useContext(AdminContext);
  const Icon = (lucide as any)[content.icon || 'MessageCircle'] || MessageCircle;
  
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3 group/wa">
      {isAdmin && (
        <div className="flex gap-2 opacity-0 group-hover/wa:opacity-100 transition-all duration-500 translate-y-4 group-hover/wa:translate-y-0 pointer-events-none group-hover/wa:pointer-events-auto">
          <button 
            onClick={() => onEdit?.('number')}
            className="bg-primary text-accent p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10 flex items-center justify-center"
            title="Editar Número"
          >
            <Phone size={14} />
          </button>
          <button 
            onClick={() => onEdit?.('message')}
            className="bg-primary text-accent p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10 flex items-center justify-center"
            title="Editar Mensagem"
          >
            <MessageSquare size={14} />
          </button>
          <button 
            onClick={() => onEdit?.('label')}
            className="bg-primary text-accent p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10 flex items-center justify-center"
            title="Editar Rótulo"
          >
            <Type size={14} />
          </button>
          <button 
            onClick={() => onEdit?.('icon')}
            className="bg-primary text-accent p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10 flex items-center justify-center"
            title="Editar Ícone"
          >
            <Sparkles size={14} />
          </button>
        </div>
      )}
      <motion.a
        href={`https://wa.me/${content.number}?text=${encodeURIComponent(content.message)}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: 1
        }}
        transition={{
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="bg-[#25D366] text-white p-5 rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.4)] flex items-center justify-center group relative"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"></div>
        <Icon size={32} fill="currentColor" className="relative z-10" />
        <span className="absolute right-full mr-6 bg-white text-primary px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-6 group-hover:translate-x-0 whitespace-nowrap pointer-events-none border border-black/5">
          {content.label}
        </span>
      </motion.a>
    </div>
  );
};

const MagneticButton = ({ children, className, variant = "primary" }: { children: React.ReactNode, className?: string, variant?: "primary" | "secondary" | "outline" }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    if (buttonRef.current) {
      buttonRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = `translate(0px, 0px)`;
    }
  };

  const variants = {
    primary: "bg-primary text-secondary hover:bg-primary/90 shadow-deep",
    secondary: "bg-accent text-secondary hover:bg-accent/90 shadow-deep",
    outline: "bg-transparent text-primary border border-primary/30 hover:bg-primary/10 shadow-lg"
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      className={`px-12 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

const TopBar = ({ content, onEditField, isScrolled }: { content: Content['topBar'], onEditField: (path: string, label: string, type: any, value: any) => void, isScrolled: boolean }) => (
  <div className={`bg-primary text-secondary py-3 px-6 text-[10px] uppercase tracking-[0.2em] hidden md:block border-b border-white/5 transition-all duration-500 ${isScrolled ? '-translate-y-full opacity-0 h-0 py-0 overflow-hidden' : 'translate-y-0 opacity-100'}`}>
    <div className="max-w-[1800px] mx-auto flex justify-between items-center">
      <div className="flex gap-8">
        <Editable onEdit={() => onEditField('topBar.phone', 'Telefone TopBar', 'text', content.phone)}>
          <span className="flex items-center gap-2 hover:text-accent transition-colors cursor-default font-bold"><Phone size={12} className="text-secondary" /> {content.phone}</span>
        </Editable>
        <Editable onEdit={() => onEditField('topBar.location', 'Localização TopBar', 'text', content.location)}>
          <span className="flex items-center gap-2 hover:text-accent transition-colors cursor-default font-bold"><MapPin size={12} className="text-secondary" /> {content.location}</span>
        </Editable>
        <Editable onEdit={() => onEditField('topBar.email', 'Email TopBar', 'text', content.email)}>
          <a href={`mailto:${content.email}`} className="flex items-center gap-2 hover:text-accent transition-colors font-bold">
            <Mail size={12} className="text-secondary" /> {content.email}
          </a>
        </Editable>
      </div>
      <div className="flex items-center gap-8">
        <Editable onEdit={() => onEditField('topBar.socials', 'Redes Sociais TopBar', 'socials', content.socials)}>
          <div className="flex gap-4">
            {content.socials.map((social, idx) => {
              const Icon = (lucide as any)[social.icon] || HelpCircle;
              return (
                <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer">
                  <Icon size={12} className="hover:text-accent cursor-pointer transition-all hover:-translate-y-0.5" />
                </a>
              );
            })}
          </div>
        </Editable>
      </div>
    </div>
  </div>
);

const Navbar = ({ content, onEditField, isScrolled }: { content: Content['navbar'], onEditField: (path: string, label: string, type: any, value: any) => void, isScrolled: boolean }) => {
  return (
    <nav className={`max-w-[1800px] mx-auto px-8 transition-all duration-700 ${isScrolled ? 'bg-primary/95 backdrop-blur-2xl rounded-full py-4 shadow-2xl border border-white/10 mt-4' : 'bg-transparent py-8'}`}>
      <div className="flex justify-between items-center relative">
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <Editable onEdit={() => onEditField('navbar.logo', 'Logo', 'logo', content.logo)} label="Logo">
            <div className="flex flex-col bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-accent/20">
              <div className="flex gap-1 items-baseline">
                <span className="text-2xl font-serif font-bold tracking-tighter leading-none text-primary">{content.logo.text1}</span>
                <span className="text-2xl font-serif font-bold tracking-tighter leading-none text-accent">{content.logo.text2}</span>
              </div>
              <span className="text-[7px] uppercase tracking-[0.5em] font-bold mt-1 text-primary/40">Exclusividade & Conforto</span>
            </div>
          </Editable>
        </motion.div>
          
          {/* Links */}
          <Editable onEdit={() => onEditField('navbar.links', 'Links de Navegação', 'navLinks', content.links)}>
            <div className="hidden lg:flex gap-12 font-bold text-xs uppercase tracking-[0.4em] text-white/80">
              {content.links.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center group">
                  <a href={item.href} className="transition-all relative group/link hover:text-white">
                    {item.label}
                    <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-accent transition-all group-hover/link:w-full"></span>
                  </a>
                </div>
              ))}
            </div>
          </Editable>

          {/* Action */}
          <div className="flex items-center gap-6">
            <Editable onEdit={() => onEditField('navbar.cta', 'Botão Navbar', 'button', { text: content.cta, link: content.ctaHref })}>
              <a href={content.ctaHref} className="hidden md:block">
                <button className="bg-accent text-white px-8 py-3 rounded-full font-bold text-[9px] uppercase tracking-[0.2em] hover:bg-white hover:text-primary transition-all duration-500 shadow-xl">
                  {content.cta}
                </button>
              </a>
            </Editable>
          </div>
        </div>
    </nav>
  );
};

const Hero = ({ content, onEditField }: { content: Content['hero'], onEditField: (path: string, label: string, type: any, value: any) => void }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0 z-0">
        <Editable 
          onEdit={() => onEditField('hero.bgImage', 'Imagem de Fundo Hero', 'image', content.bgImage)} 
          label="Fundo Hero"
          className="w-full h-full"
        >
          {/* Background Grid */}
          <div className="absolute inset-0 print-grid z-[1] pointer-events-none opacity-10"></div>
          
          {/* Background Image with Parallax and Animation */}
          <motion.div 
            style={{ y }} 
            className="absolute inset-0 h-[130%] -top-[15%]"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="w-full h-full relative">
              <img
                src={content.bgImage}
                className="w-full h-full object-cover"
                style={{ filter: 'sepia(25%) saturate(1.3) hue-rotate(-10deg) brightness(0.95)' }}
                referrerPolicy="no-referrer"
                alt="Recanto Baracho"
              />
            </div>
            {/* Refined Overlays */}
            <div className="absolute inset-0 bg-primary/30 backdrop-blur-[0.5px] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-transparent to-primary/90 pointer-events-none"></div>
            {/* Warm Gold Signature Filter */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.08) 0%, rgba(139,90,43,0.12) 50%, rgba(197,160,89,0.06) 100%)', mixBlendMode: 'multiply' }}></div>
            <div className="absolute inset-0 hero-lighting opacity-60 pointer-events-none"></div>
          </motion.div>
        </Editable>
      </div>
      
      {/* Editorial Layout Content */}
      <div className="relative z-10 max-w-[1800px] mx-auto px-8 w-full pointer-events-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Column: Main Typography */}
          <div className="lg:col-span-12 pointer-events-auto">
            <motion.div 
              style={{ opacity }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <Editable onEdit={() => onEditField('hero.subtitle', 'Subtítulo Hero', 'text', content.subtitle)}>
                <span className="text-accent font-bold uppercase tracking-[0.8em] text-[10px] mb-8 block drop-shadow-sm">
                  {content.subtitle}
                </span>
              </Editable>
              
              <motion.h1 
                className="text-7xl md:text-9xl lg:text-[11vw] text-white font-serif leading-[0.8] tracking-tighter mb-12 drop-shadow-2xl"
              >
                <Editable onEdit={() => onEditField('hero.title1', 'Título 1 Hero', 'text', content.title1)} className="block">
                  <span className="font-light italic opacity-90 block">{content.title1}</span>
                </Editable>
                <Editable onEdit={() => onEditField('hero.title2', 'Título 2 Hero', 'text', content.title2)} className="block">
                  <span className="font-bold block -mt-2">{content.title2}</span>
                </Editable>
              </motion.h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-12">
                <Editable onEdit={() => onEditField('hero.primaryBtn', 'Botão Hero', 'button', { text: content.primaryBtn, link: content.primaryBtnHref })}>
                  <a href={content.primaryBtnHref}>
                    <button className="bg-white text-primary px-16 py-6 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-accent hover:text-white transition-all duration-700 shadow-2xl transform hover:-translate-y-1">
                      {content.primaryBtn}
                    </button>
                  </a>
                </Editable>
                
                <Editable onEdit={() => onEditField('hero.location', 'Localização Hero', 'text', content.location)}>
                  <div className="flex items-center gap-6 text-white/60 text-[9px] uppercase tracking-[0.6em] font-bold">
                    <div className="w-16 h-[1px] bg-white/40"></div>
                    {content.location}
                  </div>
                </Editable>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-8 z-20 flex items-center gap-6"
      >
        <span className="text-white/20 text-[8px] uppercase tracking-[0.8em] font-bold vertical-text">Scroll</span>
        <div className="w-[1px] h-24 bg-white/10 relative overflow-hidden">
          <motion.div 
            animate={{ y: [-96, 96] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-accent/50"
          />
        </div>
      </motion.div>
    </section>
  );
};

const SectionHeading = ({ subtitle, title, centered = true }: { subtitle: string, title: string, centered?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`mb-24 ${centered ? 'text-center' : 'text-left'} relative`}
  >
    <div className="flex flex-col items-center">
      <span className="text-accent font-bold uppercase tracking-[0.6em] text-[10px] mb-6 block">{subtitle}</span>
      <div className="relative inline-block">
        <h2 className="text-6xl md:text-9xl font-serif text-primary leading-[0.9] tracking-tighter mb-4">{title}</h2>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-accent/30"></div>
      </div>
    </div>
  </motion.div>
);

const Gallery = ({ content, onEditField, isAdmin }: { 
  content: Content['gallery'],
  onEditField: (path: string, label: string, type: any, value: any) => void,
  isAdmin: boolean
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState(1);

  const categories = content.categories || [{ name: 'Todos', images: content.images }];
  const activeImages = categories[activeCategory]?.images || content.images;

  useEffect(() => {
    setCurrentIndex(0);
    setSelectedIndex(null);
  }, [activeCategory]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleItems(3);
      } else if (window.innerWidth >= 640) {
        setVisibleItems(2);
      } else {
        setVisibleItems(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, activeImages.length - visibleItems);

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % activeImages.length);
    } else {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + activeImages.length) % activeImages.length);
    } else {
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }
  };

  // Auto-play for the slider
  useEffect(() => {
    if (selectedIndex === null) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [selectedIndex, maxIndex]);

  return (
    <section id="galeria" className="py-48 bg-secondary group/gallery relative overflow-hidden">
      <div className="absolute inset-0 print-grid z-0"></div>
      <Editable onEdit={() => onEditField('gallery.bgImage', 'Imagem de Fundo Galeria', 'image', content.bgImage)} className="w-full h-full relative z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-10 absolute inset-0"
          style={{ backgroundImage: `url(${content.bgImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none"></div>
        
        <div className="max-w-[1800px] mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <Editable onEdit={() => onEditField('gallery.subtitle', 'Subtítulo Galeria', 'text', content.subtitle)}>
              <span className="text-accent font-bold uppercase tracking-[0.6em] text-[10px] mb-6 block">{content.subtitle}</span>
            </Editable>
            <Editable onEdit={() => onEditField('gallery.title', 'Título Galeria', 'text', content.title)}>
              <h2 className="text-3xl md:text-5xl font-serif text-primary leading-tight tracking-tighter italic">{content.title}</h2>
            </Editable>

            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mt-12">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${
                    activeCategory === idx
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-primary/5 text-primary/60 hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {isAdmin && (
              <div className="mt-6 flex justify-center">
                <Editable onEdit={() => onEditField('gallery.categories', 'Gerenciar Fotos por Categoria', 'gallery-categories', content.categories)}>
                  <button className="bg-primary text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-primary transition-all duration-500 shadow-lg flex items-center gap-2">
                    <Maximize2 size={14} />
                    Gerenciar Categorias
                  </button>
                </Editable>
              </div>
            )}
          </div>

          <div className="relative group/slider">
            {/* Navigation Buttons */}
            <button 
              onClick={prevImage}
              className="absolute -left-4 md:left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-primary hover:text-secondary"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute -right-4 md:right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-primary hover:text-secondary"
            >
              <ChevronRight size={24} />
            </button>

            <div className="overflow-hidden rounded-[40px]" ref={containerRef}>
              <motion.div 
                className="flex"
                animate={{ x: `-${currentIndex * (100 / visibleItems)}%` }}
                transition={{ type: "spring", damping: 30, stiffness: 100 }}
              >
                {activeImages.map((img, idx) => (
                  <div
                    key={`${activeCategory}-${idx}`}
                    className="px-2 md:px-4 shrink-0"
                    style={{ width: `${100 / visibleItems}%` }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="relative group/img rounded-[40px] overflow-hidden shadow-deep cursor-zoom-in aspect-[4/3]"
                      onClick={() => setSelectedIndex(idx)}
                    >
                      <img
                        src={img}
                        alt={`${categories[activeCategory]?.name || 'Galeria'} ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover/img:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white transform scale-50 group-hover/img:scale-100 transition-all duration-500">
                          <Maximize2 size={32} />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-3 mt-12">
              {[...Array(maxIndex + 1)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-12 bg-primary' : 'w-3 bg-primary/20 hover:bg-primary/40'}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-24 text-center">
            <Editable onEdit={() => onEditField('gallery.cta', 'Botão Galeria', 'button', { text: content.cta, link: content.ctaHref })}>
              <a href={content.ctaHref}>
                <MagneticButton variant="primary">
                  {content.cta}
                </MagneticButton>
              </a>
            </Editable>
          </div>
        </div>
      </Editable>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary/80 backdrop-blur-2xl flex items-center justify-center p-4 md:p-20"
            onClick={() => setSelectedIndex(null)}
          >
            <button 
              className="absolute top-10 right-10 text-white/50 hover:text-white transition-all z-20"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={48} />
            </button>

            <button 
              className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-all z-20 p-4 bg-white/5 rounded-full backdrop-blur-md"
              onClick={prevImage}
            >
              <ChevronLeft size={48} />
            </button>

            <button 
              className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-all z-20 p-4 bg-white/5 rounded-full backdrop-blur-md"
              onClick={nextImage}
            >
              <ChevronRight size={48} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedIndex}
                  initial={{ scale: 0.9, opacity: 0, x: 50 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  exit={{ scale: 0.9, opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={activeImages[selectedIndex]}
                  className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
                  referrerPolicy="no-referrer"
                  onClick={(e) => e.stopPropagation()}
                />
              </AnimatePresence>

              <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 text-white/60 font-bold tracking-[0.3em] text-xs">
                {selectedIndex + 1} / {activeImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const BoateSection = ({ content }: { content: Content['boate'] }) => (
  <section className="relative py-0 overflow-hidden bg-primary">
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
      {/* Image side */}
      <div className="relative h-[50vh] lg:h-auto overflow-hidden">
        <img
          src={content.img}
          className="w-full h-full object-cover"
          style={{ filter: 'sepia(20%) saturate(1.2) brightness(0.8)' }}
          referrerPolicy="no-referrer"
          alt="Boate Recanto Baracho"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent pointer-events-none lg:hidden"></div>
      </div>

      {/* Content side */}
      <div className="flex flex-col justify-center px-10 py-20 lg:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-accent font-bold uppercase tracking-[0.6em] text-[10px] mb-6 block">{content.subtitle}</span>
          <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight tracking-tighter mb-8">{content.title}</h2>
          <p className="text-white/60 text-base leading-relaxed mb-12 max-w-lg">{content.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-12">
            {content.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0"></div>
                <span className="text-white/80 text-[11px] font-bold uppercase tracking-[0.3em]">{feat}</span>
              </div>
            ))}
          </div>

          <a href={content.ctaHref}>
            <button className="bg-accent text-white px-12 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-primary transition-all duration-500 shadow-xl">
              {content.cta}
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  </section>
);

const AudiencesSection = ({ content }: { content: Content['audiences'] }) => (
  <section className="py-32 bg-secondary relative overflow-hidden">
    <div className="absolute inset-0 print-grid opacity-5 pointer-events-none"></div>
    <div className="max-w-[1400px] mx-auto px-6 relative z-10">
      <div className="text-center mb-20">
        <span className="text-accent font-bold uppercase tracking-[0.6em] text-[10px] mb-6 block">{content.subtitle}</span>
        <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight tracking-tighter">{content.title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {content.items.map((item, idx) => {
          const IconComp = (lucide as any)[item.icon] || Sparkles;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15 }}
              viewport={{ once: true }}
              className="group/card bg-white rounded-[32px] p-10 shadow-print hover:shadow-deep transition-all duration-500 border border-primary/5 flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-accent mb-8 group-hover/card:bg-accent group-hover/card:text-white transition-all duration-500">
                <IconComp size={26} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-serif text-primary mb-4 tracking-tight">{item.title}</h3>
              <p className="text-primary/50 text-sm leading-relaxed mb-8 flex-1">{item.desc}</p>
              <ul className="space-y-3 mb-10">
                {item.features.map((feat, fidx) => (
                  <li key={fidx} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-primary/60">
                    <CheckCircle2 size={14} className="text-accent shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <a href={item.ctaHref}>
                <button className="w-full py-4 rounded-full border-2 border-primary text-primary font-bold text-[9px] uppercase tracking-[0.4em] hover:bg-primary hover:text-white transition-all duration-500">
                  {item.cta}
                </button>
              </a>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

const AboutSection = ({ content, onEditField }: { content: Content['about'], onEditField: (path: string, label: string, type: any, value: any) => void }) => (
  <section id="o-espaço" className="py-32 bg-white overflow-hidden group/about relative">
    <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
      
      {/* Left Column: Two-Image Composition */}
      <div className="relative h-[600px] lg:h-[750px]">
        {/* Main Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 left-0 w-[90%] h-[90%] rounded-[60px] overflow-hidden shadow-2xl z-10"
        >
          <Editable onEdit={() => onEditField('about.bgImage', 'Imagem Principal', 'image', content.bgImage)} className="w-full h-full">
            <motion.img 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 5 }}
              src={content.bgImage} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </Editable>
        </motion.div>

        {/* Secondary Overlapping Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 1.2 }}
          className="absolute bottom-0 right-0 w-[50%] h-[45%] rounded-[40px] overflow-hidden shadow-vivid z-20 border-[12px] border-white"
        >
          <Editable onEdit={() => onEditField('about.secondaryImage', 'Imagem Secundária', 'image', content.secondaryImage || '')} className="w-full h-full">
            <motion.img 
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 3 }}
              src={content.secondaryImage} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </Editable>
        </motion.div>

        {/* Floating "15+ Years" Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="absolute top-1/2 -right-4 lg:-right-8 translate-y-[-50%] bg-white p-8 lg:p-10 rounded-[32px] shadow-2xl z-30 text-center min-w-[180px] pointer-events-none"
        >
          <div className="flex flex-col items-center pointer-events-auto">
            <Editable onEdit={() => onEditField('about.badge.val', 'Valor Badge', 'text', content.badge.val)}>
              <span className="text-5xl lg:text-6xl font-bold text-primary tracking-tighter flex items-center">
                {content.badge.val}<span className="text-accent text-4xl lg:text-5xl ml-1">+</span>
              </span>
            </Editable>
            <Editable onEdit={() => onEditField('about.badge.label', 'Rótulo Badge', 'textarea', content.badge.label)}>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 mt-2 leading-tight whitespace-pre-line">
                {content.badge.label}
              </span>
            </Editable>
          </div>
        </motion.div>

        {/* Decorative Background Element */}
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10"></div>
      </div>

      {/* Right Column: Text & Features */}
      <div className="flex flex-col">
        <div className="mb-12">
          <Editable onEdit={() => onEditField('about.title', 'Título Sobre', 'text', content.title)}>
            <h2 className="text-4xl md:text-6xl font-serif text-primary leading-[1.1] tracking-tight mb-10">
              {content.title}
            </h2>
          </Editable>
          
          <Editable onEdit={() => onEditField('about.description', 'Descrição Sobre', 'textarea', content.description)}>
            <div className="space-y-6 max-w-lg">
              {content.description.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-primary/60 text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </Editable>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-16">
          {content.features.map((feature, idx) => {
            const IconComp = (lucide as any)[feature.icon] || Sparkles;
            return (
              <div key={idx} className="flex flex-col gap-4">
                <Editable onEdit={() => onEditField(`about.features.${idx}.icon`, `Ícone Característica ${idx + 1}`, 'icon', feature.icon)}>
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all duration-500">
                    <IconComp size={24} strokeWidth={1.5} />
                  </div>
                </Editable>
                <div>
                  <Editable onEdit={() => onEditField(`about.features.${idx}.title`, `Título Característica ${idx + 1}`, 'text', feature.title)}>
                    <h4 className="text-primary font-bold text-lg mb-1">{feature.title}</h4>
                  </Editable>
                  <Editable onEdit={() => onEditField(`about.features.${idx}.desc`, `Descrição Característica ${idx + 1}`, 'text', feature.desc)}>
                    <p className="text-primary/50 text-sm leading-relaxed">{feature.desc}</p>
                  </Editable>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* CTA Link */}
        <div className="flex items-center gap-6 group/cta">
          <Editable onEdit={() => onEditField('about.cta', 'Botão Sobre', 'button', { text: content.cta, link: content.ctaHref })}>
            <a href={content.ctaHref} className="text-[12px] font-bold uppercase tracking-[0.4em] text-primary hover:text-accent transition-colors">
              {content.cta}
            </a>
          </Editable>
          <div className="h-[1px] w-24 bg-accent/30 group-hover/cta:w-32 transition-all duration-500"></div>
        </div>
      </div>

    </div>
  </section>
);

const Testimonials = ({ content, onEditField }: { content: Content['testimonials'], onEditField: (path: string, label: string, type: any, value: any) => void }) => (
  <section className="py-32 bg-secondary overflow-hidden relative group/testimonials">
    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
      <div className="absolute top-20 left-20 w-96 h-96 border border-primary rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-[500px] h-[500px] border border-primary rounded-full"></div>
    </div>
    
    <div className="max-w-[1800px] mx-auto px-6">
      <div className="text-center mb-24">
        <Editable onEdit={() => onEditField('testimonials.subtitle', 'Subtítulo Depoimentos', 'text', content.subtitle)}>
          <span className="text-primary font-bold uppercase tracking-[0.4em] text-[10px] mb-4 block">{content.subtitle}</span>
        </Editable>
        <Editable onEdit={() => onEditField('testimonials.title', 'Título Depoimentos', 'text', content.title)}>
          <h2 className="text-4xl md:text-6xl text-primary font-bold tracking-tighter">{content.title}</h2>
        </Editable>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {content.items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[50px] border border-primary/5 hover:border-accent/30 transition-all group shadow-deep"
          >
            <Quote className="text-accent mb-8 opacity-40 group-hover:opacity-100 transition-opacity" size={40} />
            <Editable onEdit={() => onEditField(`testimonials.items.${idx}.text`, `Texto Depoimento ${idx + 1}`, 'textarea', item.text)}>
              <p className="text-primary/80 text-xl font-light italic leading-relaxed mb-12">"{item.text}"</p>
            </Editable>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                {item.name[0]}
              </div>
              <div>
                <Editable onEdit={() => onEditField(`testimonials.items.${idx}.name`, `Nome Depoimento ${idx + 1}`, 'text', item.name)}>
                  <h4 className="text-primary font-bold tracking-tight">{item.name}</h4>
                </Editable>
                <Editable onEdit={() => onEditField(`testimonials.items.${idx}.date`, `Data Depoimento ${idx + 1}`, 'text', item.date)}>
                  <p className="text-accent/60 text-[10px] uppercase tracking-widest">{item.date}</p>
                </Editable>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const SuitesSection = ({ content, onEditField }: { content: Content['suites'], onEditField: (path: string, label: string, type: any, value: any) => void }) => (
  <section id="suítes" className="py-32 bg-primary group/suites relative overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="order-2 lg:order-1 relative h-[600px] rounded-[40px] overflow-hidden shadow-2xl">
          <Editable onEdit={() => onEditField('suites.featured.img', 'Imagem Suíte Principal', 'image', content.featured.img)} className="w-full h-full">
            <img src={content.featured.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </Editable>
        </div>
        
        <div className="order-1 lg:order-2">
          <Editable onEdit={() => onEditField('suites.subtitle', 'Subtítulo Suítes', 'text', content.subtitle)}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-[1px] bg-accent"></div>
              <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px]">{content.subtitle}</span>
            </div>
          </Editable>
          <Editable onEdit={() => onEditField('suites.title', 'Título Suítes', 'text', content.title)}>
            <h2 className="text-4xl md:text-6xl font-serif text-secondary leading-tight tracking-tight mb-8">{content.title}</h2>
          </Editable>
          <Editable onEdit={() => onEditField('suites.description', 'Descrição Suítes', 'textarea', content.description)}>
            <p className="text-secondary/70 text-lg leading-relaxed mb-12">{content.description}</p>
          </Editable>
          
          <div className="grid grid-cols-2 gap-6 mb-12">
            {content.featured.amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-3 text-secondary/60">
                <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                <Editable onEdit={() => onEditField(`suites.featured.amenities.${idx}`, `Comodidade ${idx + 1}`, 'text', amenity)}>
                  <span className="text-xs font-bold uppercase tracking-widest">{amenity}</span>
                </Editable>
              </div>
            ))}
          </div>
          
          <Editable onEdit={() => onEditField('suites.cta', 'Botão Suítes', 'button', { text: content.cta, link: content.ctaHref })}>
            <button className="bg-accent text-primary px-10 py-4 rounded-full font-bold text-[12px] uppercase tracking-[0.2em] hover:bg-secondary hover:text-primary transition-all duration-500 shadow-lg">
              {content.cta}
            </button>
          </Editable>
        </div>
      </div>
    </div>
  </section>
);

const LazerSection = ({ content, onEditField }: { content: Content['lazer'], onEditField: (path: string, label: string, type: any, value: any) => void }) => (
  <section id="lazer" className="py-32 bg-secondary group/lazer relative overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="mb-20 text-center max-w-3xl mx-auto">
        <Editable onEdit={() => onEditField('lazer.subtitle', 'Subtítulo Lazer', 'text', content.subtitle)}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-accent"></div>
            <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px]">{content.subtitle}</span>
            <div className="w-8 h-[1px] bg-accent"></div>
          </div>
        </Editable>
        <Editable onEdit={() => onEditField('lazer.title', 'Título Lazer', 'text', content.title)}>
          <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight tracking-tight mb-8">{content.title}</h2>
        </Editable>
        <Editable onEdit={() => onEditField('lazer.description', 'Descrição Lazer', 'textarea', content.description)}>
          <p className="text-primary/60 text-lg leading-relaxed">{content.description}</p>
        </Editable>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {content.items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group/card relative h-[400px] rounded-[30px] overflow-hidden"
          >
            <Editable onEdit={() => onEditField(`lazer.items.${idx}.img`, `Imagem Lazer ${idx + 1}`, 'image', item.img)} className="w-full h-full">
              <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <div className="bg-gradient-to-br from-primary/80 via-primary/40 to-accent/80 backdrop-blur-md p-8 rounded-[40px] border border-white/10 text-center w-full max-w-[90%] shadow-2xl pointer-events-auto">
                  <Editable onEdit={() => onEditField(`lazer.items.${idx}.title`, `Título Lazer ${idx + 1}`, 'text', item.title)}>
                    <h3 className="text-white font-serif text-2xl mb-3 leading-tight drop-shadow-lg">{item.title}</h3>
                  </Editable>
                  <div className="w-12 h-[1px] bg-accent/50 mx-auto mb-4"></div>
                  <Editable onEdit={() => onEditField(`lazer.items.${idx}.desc`, `Descrição Lazer ${idx + 1}`, 'text', item.desc)}>
                    <p className="text-white/90 text-[10px] font-bold uppercase tracking-[0.3em] leading-relaxed drop-shadow-md">{item.desc}</p>
                  </Editable>
                </div>
              </div>
            </Editable>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const MonteVerdeSection = ({ content, onEditField }: { content: Content['monteVerde'], onEditField: (path: string, label: string, type: any, value: any) => void }) => (
  <section id="monte-verde" className="py-32 bg-secondary group/mv relative overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-6">
      <div className="mb-20 text-center">
        <Editable onEdit={() => onEditField('monteVerde.subtitle', 'Subtítulo Monte Verde', 'text', content.subtitle)}>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-[1px] bg-accent"></div>
            <span className="text-accent font-bold uppercase tracking-[0.4em] text-[10px]">{content.subtitle}</span>
            <div className="w-8 h-[1px] bg-accent"></div>
          </div>
        </Editable>
        <Editable onEdit={() => onEditField('monteVerde.title', 'Título Monte Verde', 'text', content.title)}>
          <h2 className="text-4xl md:text-6xl font-serif text-primary leading-tight tracking-tight">{content.title}</h2>
        </Editable>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {content.items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group/mv-card"
          >
            {item.link ? (
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="block relative h-[500px] rounded-[40px] overflow-hidden shadow-xl group/card-inner">
                <Editable onEdit={() => onEditField(`monteVerde.items.${idx}.img`, `Imagem MV ${idx + 1}`, 'image', item.img)} className="w-full h-full">
                  <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/card-inner:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-8 translate-y-8 group-hover/card-inner:translate-y-0 transition-transform duration-500 pointer-events-none">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.1 }} className="pointer-events-auto">
                      <Editable onEdit={() => onEditField(`monteVerde.items.${idx}.title`, `Título MV ${idx + 1}`, 'text', item.title)}>
                        <h3 className="text-3xl font-serif text-white mb-3 drop-shadow-lg flex items-center gap-2">{item.title} <MapPin size={18} className="text-accent" /></h3>
                      </Editable>
                      <Editable onEdit={() => onEditField(`monteVerde.items.${idx}.desc`, `Descrição MV ${idx + 1}`, 'text', item.desc)}>
                        <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover/card-inner:opacity-100 transition-opacity duration-500 delay-100 max-w-[90%]">{item.desc}</p>
                      </Editable>
                    </motion.div>
                  </div>
                </Editable>
              </a>
            ) : (
            <div className="relative h-[500px] rounded-[40px] overflow-hidden shadow-xl group/card-inner">
              <Editable onEdit={() => onEditField(`monteVerde.items.${idx}.img`, `Imagem MV ${idx + 1}`, 'image', item.img)} className="w-full h-full">
                <img src={item.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/card-inner:scale-110" referrerPolicy="no-referrer" />
                
                {/* Overlay with Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-8 translate-y-8 group-hover/card-inner:translate-y-0 transition-transform duration-500 pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="pointer-events-auto"
                  >
                    <Editable onEdit={() => onEditField(`monteVerde.items.${idx}.title`, `Título MV ${idx + 1}`, 'text', item.title)}>
                      <h3 className="text-3xl font-serif text-white mb-3 drop-shadow-lg">{item.title}</h3>
                    </Editable>
                    <Editable onEdit={() => onEditField(`monteVerde.items.${idx}.desc`, `Descrição MV ${idx + 1}`, 'text', item.desc)}>
                      <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover/card-inner:opacity-100 transition-opacity duration-500 delay-100 max-w-[90%]">{item.desc}</p>
                    </Editable>
                  </motion.div>
                </div>
              </Editable>
            </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const GastronomySection = ({ content, onEditField }: { content: Content['gastronomy'], onEditField: (path: string, label: string, type: any, value: any) => void }) => (
  <section className="relative h-[800px] group/gastro overflow-hidden">
    <Editable onEdit={() => onEditField('gastronomy.img', 'Imagem Gastronomia', 'image', content.img)} className="absolute inset-0 z-0">
      <img src={content.img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-none">
        <div className="max-w-4xl mx-auto px-12 py-16 text-center bg-black/50 backdrop-blur-md rounded-[60px] border border-white/10">
          <div className="pointer-events-auto">
            <Editable onEdit={() => onEditField('gastronomy.subtitle', 'Subtítulo Gastronomia', 'text', content.subtitle)}>
              <span className="text-accent font-bold uppercase tracking-[0.4em] text-[12px] mb-8 block">{content.subtitle}</span>
            </Editable>
            <Editable onEdit={() => onEditField('gastronomy.title', 'Título Gastronomia', 'text', content.title)}>
              <h2 className="text-5xl md:text-8xl font-serif text-white leading-tight tracking-tight mb-12 italic">{content.title}</h2>
            </Editable>
            <Editable onEdit={() => onEditField('gastronomy.cta', 'Botão Gastronomia', 'button', { text: content.cta, link: content.ctaHref })}>
              <button className="bg-white text-primary px-12 py-5 rounded-full font-bold text-[14px] uppercase tracking-[0.2em] hover:bg-accent hover:text-primary transition-all duration-500 shadow-2xl">
                {content.cta}
              </button>
            </Editable>
          </div>
        </div>
      </div>
    </Editable>
  </section>
);

const ContactSection = ({ content, onEditField, isAdmin }: { content: Content['contactSection'], onEditField: (path: string, label: string, type: any, value: any) => void, isAdmin: boolean }) => {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulating email sending to content.form.recipientEmail
    console.log(`Sending form data to: ${content.form.recipientEmail}`, formState);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    setFormState({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="contato" className="py-32 bg-secondary relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-primary/5"></div>
      
      <div className="max-w-[1800px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-6">
              <Editable onEdit={() => onEditField('contactSection.subtitle', 'Subtítulo Contato', 'text', content.subtitle)}>
                <span className="text-accent font-bold uppercase tracking-[0.4em] text-[11px] block">{content.subtitle}</span>
              </Editable>
              <Editable onEdit={() => onEditField('contactSection.title', 'Título Contato', 'text', content.title)}>
                <h2 className="text-6xl md:text-8xl font-serif text-primary leading-[0.9] tracking-tighter">{content.title}</h2>
              </Editable>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Localização</h4>
                <Editable onEdit={() => onEditField('contactSection.map.address', 'Endereço', 'text', content.map.address)}>
                  <p className="text-primary text-lg font-light leading-relaxed">{content.map.address}</p>
                </Editable>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Atendimento</h4>
                <Editable onEdit={() => onEditField('contactSection.map.hours', 'Horário Atendimento', 'textarea', content.map.hours || 'Segunda a Sábado\n09:00 — 18:00')}>
                  <p className="text-primary text-lg font-light leading-relaxed whitespace-pre-line">{content.map.hours || 'Segunda a Sábado\n09:00 — 18:00'}</p>
                </Editable>
              </div>
            </div>

            <div className="aspect-square md:aspect-video rounded-[40px] overflow-hidden shadow-2xl border border-primary/5 relative group">
              <Editable onEdit={() => onEditField('contactSection.map.embedUrl', 'URL Embed Mapa', 'text', content.map.embedUrl)} className="w-full h-full relative">
                <iframe
                  src={content.map.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-1000"
                ></iframe>
                {isAdmin && <div className="absolute inset-0 z-10 cursor-pointer bg-transparent"></div>}
              </Editable>
              
              <a 
                href={content.map.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center pointer-events-none"
              >
                <div className="bg-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform pointer-events-auto">
                  <MapPin size={18} className="text-accent" />
                  <span className="text-primary font-bold text-[11px] uppercase tracking-widest">Abrir no Maps</span>
                </div>
              </a>

              {isAdmin && (
                <div className="absolute bottom-6 right-6 z-20">
                  <Editable onEdit={() => onEditField('contactSection.map.googleMapsUrl', 'URL Google Maps', 'text', content.map.googleMapsUrl)}>
                    <button className="bg-white text-primary px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl hover:bg-accent transition-all flex items-center gap-2">
                      <Edit3 size={14} />
                      Editar Link Maps
                    </button>
                  </Editable>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-primary p-12 md:p-20 rounded-[60px] shadow-deep relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
              {isAdmin && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-8">
                  <Editable onEdit={() => onEditField('contactSection.form.recipientEmail', 'E-mail de Recebimento', 'text', content.form.recipientEmail)}>
                    <div className="flex items-center gap-3 text-accent text-[10px] font-bold uppercase tracking-widest">
                      <lucide.Mail size={14} />
                      <span>Receber em: {content.form.recipientEmail}</span>
                    </div>
                  </Editable>
                </div>
              )}
              <div className="space-y-8">
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-transparent border-b border-white py-4 outline-none focus:border-accent transition-all text-white text-lg font-light peer"
                    placeholder=" "
                  />
                  <label className="absolute left-0 top-4 text-white/50 text-lg font-light transition-all pointer-events-none peer-focus:-top-6 peer-focus:text-accent peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-accent peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest">
                    {content.form.namePlaceholder}
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-transparent border-b border-white py-4 outline-none focus:border-accent transition-all text-white text-lg font-light peer"
                    placeholder=" "
                  />
                  <label className="absolute left-0 top-4 text-white/50 text-lg font-light transition-all pointer-events-none peer-focus:-top-6 peer-focus:text-accent peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-accent peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest">
                    {content.form.emailPlaceholder}
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-white py-4 outline-none focus:border-accent transition-all text-white text-lg font-light peer"
                    placeholder=" "
                  />
                  <label className="absolute left-0 top-4 text-white/50 text-lg font-light transition-all pointer-events-none peer-focus:-top-6 peer-focus:text-accent peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-accent peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest">
                    {content.form.phonePlaceholder}
                  </label>
                </div>

                <div className="relative group">
                  <textarea
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-transparent border-b border-white py-4 outline-none focus:border-accent transition-all text-white text-lg font-light peer resize-none"
                    placeholder=" "
                  />
                  <label className="absolute left-0 top-4 text-white/50 text-lg font-light transition-all pointer-events-none peer-focus:-top-6 peer-focus:text-accent peer-focus:text-xs peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-accent peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest">
                    {content.form.messagePlaceholder}
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-white py-6 rounded-full font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-primary transition-all disabled:opacity-50 relative overflow-hidden group/btn"
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Enviando...' : submitted ? 'Mensagem Enviada!' : content.form.submitBtn}
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
              </button>

              {submitted && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent text-center font-bold text-xs uppercase tracking-widest">
                  {isAdmin 
                    ? `Simulação: Mensagem enviada para ${content.form.recipientEmail}`
                    : "Recebemos sua solicitação. Entraremos em contato em breve."}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const LoginModal = ({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (password: string) => boolean }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[40px] p-12 max-w-md w-full relative z-10 shadow-2xl border border-primary/5"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <lucide.Lock className="text-accent" size={24} />
          </div>
          <h3 className="text-2xl font-serif text-primary mb-2">Acesso Restrito</h3>
          <p className="text-primary/60 text-sm">Digite a senha de administrador para continuar.</p>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const success = onLogin(password);
          if (!success) {
            setError(true);
          } else {
            setPassword('');
          }
        }}>
          <div className="space-y-4">
            <input 
              type="password" 
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Senha"
              className={`w-full bg-secondary px-6 py-4 rounded-2xl outline-none border-2 transition-all ${error ? 'border-red-500' : 'border-transparent focus:border-accent'}`}
            />
            {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">Senha Incorreta</p>}
            <button 
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-accent hover:text-primary transition-all duration-500 shadow-lg"
            >
              Entrar
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-primary/40 py-2 font-bold text-[10px] uppercase tracking-widest hover:text-primary transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Footer = ({ content, onEditField, isAdmin, onLogin, onLogout }: { 
  content: Content['footer'], 
  onEditField: (path: string, label: string, type: any, value: any) => void,
  isAdmin: boolean,
  onLogin: () => void,
  onLogout: () => void
}) => (
  <footer className="bg-primary text-white pt-32 pb-16 relative overflow-hidden border-t border-white/10">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
    
    <div className="max-w-[1800px] mx-auto px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
        <div className="space-y-10">
          <Editable onEdit={() => onEditField('footer.logo', 'Logo Rodapé', 'logo', content.logo)} label="Logo Rodapé">
            <div className="flex items-center gap-4">
              <TreePine className="text-accent" size={32} />
              <span className="text-3xl font-serif font-bold tracking-tighter text-white">
                {content.logo.text1}<span className="text-accent">{content.logo.text2}</span>
              </span>
            </div>
          </Editable>
          <Editable onEdit={() => onEditField('footer.description', 'Descrição Rodapé', 'textarea', content.description)}>
            <p className="text-white/60 leading-relaxed font-light text-lg italic font-serif max-w-sm">
              "{content.description}"
            </p>
          </Editable>
          <Editable onEdit={() => onEditField('footer.socials', 'Redes Sociais Rodapé', 'socials', content.socials)}>
            <div className="flex gap-4">
              {content.socials.map((social, idx) => {
                const Icon = (lucide as any)[social.icon] || HelpCircle;
                return (
                  <motion.a key={idx} whileHover={{ y: -3 }} href={social.url} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all text-white">
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </Editable>
        </div>

        <div className="space-y-8">
          <Editable onEdit={() => onEditField('footer.links', 'Menu Rodapé', 'navLinks', content.links)}>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent mb-8">Navegação</h4>
              <ul className="space-y-4 text-white/60 font-medium text-xs uppercase tracking-widest">
                {content.links.map((link, idx) => (
                  <li key={idx}><a href={link.href} className="hover:text-accent transition-colors">{link.label}</a></li>
                ))}
              </ul>
            </div>
          </Editable>
        </div>

        <div className="space-y-8">
          <Editable onEdit={() => onEditField('footer.newsletter.title', 'Título Newsletter', 'text', content.newsletter.title)}>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">{content.newsletter.title}</h4>
          </Editable>
          <Editable onEdit={() => onEditField('footer.newsletter.desc', 'Descrição Newsletter', 'textarea', content.newsletter.desc)}>
            <p className="text-white/60 text-sm font-light leading-relaxed">{content.newsletter.desc}</p>
          </Editable>
          <div className="relative group max-w-xs">
            <Editable onEdit={() => onEditField('footer.newsletter.placeholder', 'Placeholder Newsletter', 'text', content.newsletter.placeholder)}>
              <input 
                type="email" 
                placeholder={content.newsletter.placeholder} 
                className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-accent transition-colors placeholder:text-white/40 text-sm text-white"
              />
            </Editable>
            <button className="absolute right-0 bottom-3 text-accent hover:text-white transition-colors">
              <ArrowRight size={18} />
            </button>
          </div>
          {isAdmin && (
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <Editable onEdit={() => onEditField('footer.newsletter.recipientEmail', 'E-mail Destinatário Newsletter', 'text', content.newsletter.recipientEmail)}>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Destinatário:</span>
                  <span className="text-xs text-white/60 truncate">{content.newsletter.recipientEmail}</span>
                </div>
              </Editable>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <Editable onEdit={() => onEditField('footer.contact.title', 'Título Contato', 'text', content.contact.title)}>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">{content.contact.title}</h4>
          </Editable>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <MapPin className="text-accent shrink-0" size={18} />
              <div className="flex flex-col gap-1">
                <Editable onEdit={() => onEditField('footer.contact.address', 'Endereço Rodapé', 'text', content.contact.address)}>
                  <span className="text-sm font-light text-white/80">{content.contact.address}</span>
                </Editable>
                <Editable onEdit={() => onEditField('footer.contact.addressSub', 'Sub-endereço Rodapé', 'text', content.contact.addressSub)}>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">{content.contact.addressSub}</span>
                </Editable>
              </div>
            </li>
            <li className="flex gap-4 items-center">
              <Phone className="text-accent shrink-0" size={18} />
              <Editable onEdit={() => onEditField('footer.contact.phone', 'Telefone Rodapé', 'text', content.contact.phone)}>
                <span className="text-sm font-light text-white/80">{content.contact.phone}</span>
              </Editable>
            </li>
            <li className="flex gap-4 items-center">
              <MessageCircle className="text-[#25D366] shrink-0" size={18} />
              <Editable onEdit={() => onEditField('footer.contact.phone', 'WhatsApp Rodapé', 'text', content.contact.phone)}>
                <a 
                  href={`https://wa.me/${content.contact.phone.replace(/\D/g, '')}?text=Olá!`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-[#25D366] hover:underline"
                >
                  Chamar no WhatsApp
                </a>
              </Editable>
            </li>
            <li className="flex gap-4 items-center">
              <Mail className="text-accent shrink-0" size={18} />
              <Editable onEdit={() => onEditField('footer.contact.email', 'Email Rodapé', 'text', content.contact.email)}>
                <a href={`mailto:${content.contact.email}`} className="text-sm font-light text-white/80 hover:text-accent transition-colors">
                  {content.contact.email}
                </a>
              </Editable>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-12 border-t border-white/10 flex flex-col md:grid md:grid-cols-3 items-center gap-8 text-white/50 text-[10px] font-bold uppercase tracking-[0.3em]">
        <Editable onEdit={() => onEditField('footer.copyright', 'Copyright', 'text', content.copyright)}>
          <p className="md:text-left text-white">{content.copyright}</p>
        </Editable>
        <div className="flex justify-center gap-8">
          <Editable onEdit={() => onEditField('footer.privacy', 'Privacidade', 'text', content.privacy)}>
            <a href="#" className="hover:text-accent transition-colors">{content.privacy}</a>
          </Editable>
          <Editable onEdit={() => onEditField('footer.terms', 'Termos', 'text', content.terms)}>
            <a href="#" className="hover:text-accent transition-colors">{content.terms}</a>
          </Editable>
        </div>
        <div className="flex justify-center md:justify-start gap-8">
          {isAdmin ? (
            <button onClick={onLogout} className="flex items-center gap-2 text-accent hover:text-white transition-colors cursor-pointer">
              <lucide.LogOut size={14} /> Sair
            </button>
          ) : (
            <button onClick={onLogin} className="flex items-center gap-2 text-white/30 hover:text-accent transition-colors cursor-pointer">
              <lucide.LogIn size={14} /> Entrar
            </button>
          )}
        </div>
      </div>
    </div>
  </footer>
);


const FAQSection = ({ content, onEditField }: { content: Content['faq'], onEditField: (path: string, label: string, type: any, value: any) => void }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2 z-0"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <Editable onEdit={() => onEditField('faq.subtitle', 'Subtítulo FAQ', 'text', content.subtitle)}>
            <span className="text-accent font-bold uppercase tracking-[0.6em] text-[10px] mb-4 block">{content.subtitle}</span>
          </Editable>
          <Editable onEdit={() => onEditField('faq.title', 'Título FAQ', 'text', content.title)}>
            <h2 className="text-5xl md:text-7xl font-serif text-primary tracking-tighter italic">{content.title}</h2>
          </Editable>
        </div>

        <div className="space-y-4">
          {content.items.map((item, index) => (
            <motion.div 
              key={index}
              initial={false}
              className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left group"
              >
                <Editable onEdit={() => onEditField(`faq.items.${index}.question`, 'Pergunta FAQ', 'text', item.question)}>
                  <span className="text-lg font-medium text-primary group-hover:text-accent transition-colors">{item.question}</span>
                </Editable>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-accent"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-secondary/70 leading-relaxed">
                      <Editable onEdit={() => onEditField(`faq.items.${index}.answer`, 'Resposta FAQ', 'textarea', item.answer)}>
                        {item.answer}
                      </Editable>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [content, setContent] = useState<Content | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeEditField, setActiveEditField] = useState<{ path: string, label: string, type: 'text' | 'textarea' | 'image' | 'number' | 'button', value: any } | null>(null);

  const handleLogin = (password: string) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setIsLoginModalOpen(false);
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => setContent(data));
  }, []);

  const openFieldEditor = (path: string, label: string, type: any, value: any) => {
    setActiveEditField({ path, label, type, value });
  };

  const handleSave = async (newContent: Content) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });
      if (res.ok) {
        setContent(newContent);
        setActiveEditField(null);
        // alert('Conteúdo salvo com sucesso!');
      }
    } catch (error) {
      console.error('Failed to save', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldSave = (newValue: any) => {
    if (!activeEditField || !content) return;
    
    const newContent = { ...content };
    
    const setValueByPath = (obj: any, path: string, val: any) => {
      const keys = path.split('.');
      let current = obj;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = val;
    };

    if (activeEditField.type === 'button') {
      const textPath = activeEditField.path;
      let linkPath = textPath + 'Href';
      
      if (textPath.endsWith('.label')) {
        linkPath = textPath.replace('.label', '.href');
      } else if (textPath.endsWith('Btn')) {
        linkPath = textPath + 'Href';
      } else if (textPath.endsWith('cta')) {
        linkPath = textPath + 'Href';
      }

      setValueByPath(newContent, textPath, newValue.text);
      try {
        setValueByPath(newContent, linkPath, newValue.link);
      } catch (e) {
        console.warn(`Could not find link path for ${textPath}`);
      }
    } else {
      setValueByPath(newContent, activeEditField.path, newValue);
    }
    
    handleSave(newContent);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!content) return <div className="h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <AdminContext.Provider value={{ isAdmin }}>
      <div className="min-h-screen bg-white selection:bg-primary selection:text-secondary scroll-smooth relative">
        <CustomCursor />
        
        {activeEditField && (
          <QuickEditSidebar 
            field={activeEditField}
            onSave={handleFieldSave}
            onClose={() => setActiveEditField(null)}
            isSaving={isSaving}
          />
        )}

        <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <TopBar content={content.topBar} onEditField={openFieldEditor} isScrolled={isScrolled} />
            <Navbar content={content.navbar} onEditField={openFieldEditor} isScrolled={isScrolled} />
          </div>
        </header>
        
        <main className="pt-0 relative">
          <Hero content={content.hero} onEditField={openFieldEditor} />
          <AboutSection content={content.about} onEditField={openFieldEditor} />
          <LazerSection content={content.lazer} onEditField={openFieldEditor} />
          <BoateSection content={content.boate} />
          <AudiencesSection content={content.audiences} />
          <SuitesSection content={content.suites} onEditField={openFieldEditor} />
          <MonteVerdeSection content={content.monteVerde} onEditField={openFieldEditor} />
          <GastronomySection content={content.gastronomy} onEditField={openFieldEditor} />
          <Gallery content={content.gallery} onEditField={openFieldEditor} isAdmin={isAdmin} />
          
          <section className="py-48 bg-primary group/stats relative overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Editable 
                onEdit={() => openFieldEditor('stats.bgImage', 'Imagem de Fundo Stats', 'image', content.stats.bgImage)} 
                label="Fundo Stats"
                className="w-full h-full"
              >
                <div 
                  className="w-full h-full bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${content.stats.bgImage})` }}
                ></div>
              </Editable>
            </div>
            <div className="absolute inset-0 print-grid opacity-10 z-0 pointer-events-none"></div>
            <div className="max-w-[1800px] mx-auto px-6 relative z-10 pointer-events-none">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24">
                  {content.stats.items.map((stat, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="text-center group/stat pointer-events-auto"
                    >
                      <Editable onEdit={() => openFieldEditor(`stats.items.${idx}.val`, `Valor Stat ${idx + 1}`, 'text', stat.val)}>
                        <div className="text-5xl md:text-7xl font-serif font-light text-secondary mb-4 tracking-tighter group-hover/stat:text-accent transition-colors duration-500">
                          {stat.val}<span className="text-accent group-hover/stat:text-secondary transition-colors duration-500">+</span>
                        </div>
                      </Editable>
                      <Editable onEdit={() => openFieldEditor(`stats.items.${idx}.label`, `Rótulo Stat ${idx + 1}`, 'text', stat.label)}>
                        <div className="text-[10px] md:text-[11px] font-bold text-secondary/40 uppercase tracking-[0.4em]">
                          {stat.label}
                        </div>
                      </Editable>
                      <div className="w-12 h-[1px] bg-secondary/10 mx-auto mt-8 group-hover/stat:w-24 group-hover/stat:bg-accent transition-all duration-500"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
          </section>

          <Testimonials content={content.testimonials} onEditField={openFieldEditor} />
          
          <ContactSection 
            content={content.contactSection} 
            onEditField={openFieldEditor} 
            isAdmin={isAdmin}
          />

          <FAQSection 
            content={content.faq} 
            onEditField={openFieldEditor} 
          />
        </main>

        <Footer 
          content={content.footer} 
          onEditField={openFieldEditor} 
          isAdmin={isAdmin}
          onLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
        />

        <WhatsAppButton 
          content={content.whatsapp} 
          onEdit={(type) => {
            if (type === 'number') openFieldEditor('whatsapp.number', 'Número WhatsApp', 'text', content.whatsapp.number);
            if (type === 'message') openFieldEditor('whatsapp.message', 'Mensagem WhatsApp', 'textarea', content.whatsapp.message);
            if (type === 'label') openFieldEditor('whatsapp.label', 'Rótulo WhatsApp', 'text', content.whatsapp.label);
            if (type === 'icon') openFieldEditor('whatsapp.icon', 'Ícone WhatsApp', 'icon', content.whatsapp.icon);
          }} 
        />

        <AnimatePresence>
          {isLoginModalOpen && (
            <LoginModal 
              isOpen={isLoginModalOpen} 
              onClose={() => setIsLoginModalOpen(false)} 
              onLogin={handleLogin} 
            />
          )}
        </AnimatePresence>
      </div>
    </AdminContext.Provider>
  );
}
