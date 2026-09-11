import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingBag, Search, Plus, Minus, X, Instagram, MapPin, MessageCircle, ChevronRight, CakeSlice, Heart, Settings, Pencil, Trash2, Home, Menu, MoreHorizontal, LogOut } from 'lucide-react';
import './styles.css';
import './auth.css';
import { supabase } from './supabase.js';

const initialProducts = [
  { id: 1, category: 'Bolos', name: 'Bolo de Chocolate', description: 'Massa fofinha, brigadeiro cremoso e cobertura de chocolate.', price: 55, unit: 'A partir de', minQuantity: 1, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85', available: true, featured: true },
  { id: 2, category: 'Bolos', name: 'Bolo de Morango', description: 'Creme de ninho, morangos frescos e massa branca.', price: 65, unit: 'A partir de', minQuantity: 1, image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=85', available: true, featured: true },
  { id: 3, category: 'Doces', name: 'Brigadeiros Gourmet', description: 'Brigadeiros artesanais, feitos na hora e super cremosos.', price: 75, unit: '100 unidades', minQuantity: 1, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=900&q=85', available: true, featured: true },
  { id: 4, category: 'Doces', name: 'Beijinho de Coco', description: 'O clássico beijinho com coco e muito carinho.', price: 75, unit: '100 unidades', minQuantity: 1, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85', available: true, featured: false },
  { id: 5, category: 'Kits Festa', name: 'Kit Festa Especial', description: 'Bolo + docinhos para deixar sua comemoração ainda mais gostosa.', price: 149, unit: 'Kit', minQuantity: 1, image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=900&q=85', available: true, featured: true },
  { id: 6, category: 'Bolos', name: 'Bolo de Ninho', description: 'Massa branca, creme de leite ninho e acabamento delicado.', price: 65, unit: 'A partir de', minQuantity: 1, image: 'https://images.unsplash.com/photo-1602351447937-745cb720612f?auto=format&fit=crop&w=900&q=85', available: true, featured: false },
];
const WA = '5546933001791';

function App() {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('maristela-products') || 'null') || initialProducts);
  const [category, setCategory] = useState('Todos');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [modal, setModal] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (mounted) {
        setSession(currentSession);
        setAuthLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setAuthLoading(false);
      if (!currentSession) setAdmin(false);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const save = next => { setProducts(next); localStorage.setItem('maristela-products', JSON.stringify(next)); };
  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  const filtered = useMemo(() => products.filter(p => p.available && (category === 'Todos' || p.category === category) && `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())), [products, category, search]);
  const featured = products.filter(p => p.available && p.featured).slice(0, 4);
  const add = (p, quantity = Math.max(1, Number(p.minQuantity) || 1)) => setCart(c => { const found = c.find(x => x.id === p.id); return found ? c.map(x => x.id === p.id ? {...x, qty: x.qty + quantity} : x) : [...c, {...p, qty: quantity}]; });
  const total = cart.reduce((s, p) => s + p.price * p.qty, 0);
  const cartCount = cart.length;
  const checkout = () => { const valid = cart.every(p => p.qty >= Math.max(1, Number(p.minQuantity) || 1)); if (!valid) return; const text = `Olá, Maristela! 😊 Gostaria de fazer um pedido:\n\n${cart.map(p => `🍰 ${p.name} — ${p.qty}x — R$ ${(p.price*p.qty).toFixed(2).replace('.', ',')}`).join('\n')}\n\n💰 Total aproximado: R$ ${total.toFixed(2).replace('.', ',')}\n\nGostaria de confirmar disponibilidade e combinar a entrega/retirada.`; window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank'); };
  const goTo = id => { setMobileMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  const openAdmin = () => { if (authLoading) return; if (session) setAdmin(true); else setLoginOpen(true); };

  return <>
    <header className="header">
      <button className="mobile-menu-btn" onClick={() => setMobileMenu(true)} aria-label="Abrir menu"><Menu size={22}/></button>
      <a className="brand" href="#inicio" onClick={() => setMobileMenu(false)}><span className="brand-mark">M</span><span><b>Doces e Delícias</b><small>da Maristela</small></span></a>
      <nav><a href="#inicio">Início</a><a href="#cardapio">Cardápio</a><a href="#sobre">Sobre</a><a href="#encomendas">Encomendas</a></nav>
      <div className="header-actions"><button className="icon-btn desktop-admin" onClick={openAdmin} title="Área da Maristela"><Settings size={18}/></button><button className="cart-btn" onClick={() => setModal('cart')} aria-label="Abrir carrinho"><ShoppingBag size={18}/>{cartCount > 0 && <span>{cartCount}</span>}</button></div>
    </header>

    <main id="inicio">
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow">FEITO COM CARINHO • VITORINO - PR</p><h1>Mais do que doces, entregamos <i>felicidade.</i></h1><p className="hero-text">Bolos, doces e sobremesas feitos com muito carinho para tornar o seu dia mais doce.</p><div className="hero-buttons"><a href="#cardapio" className="primary">Ver cardápio <ChevronRight size={18}/></a><a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer" className="secondary"><MessageCircle size={18}/> Falar pelo WhatsApp</a></div></div>
        <div className="hero-photo"><img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=90"/><div className="hero-badge"><Heart size={15} fill="currentColor"/><span>Feito com amor</span></div></div>
      </section>

      <section className="trust"><div><CakeSlice/><span><b>Produção artesanal</b><small>Feito com cuidado</small></span></div><div><Heart/><span><b>Com carinho</b><small>Qualidade em cada receita</small></span></div><div><MessageCircle/><span><b>Encomendas</b><small>Atendimento pelo WhatsApp</small></span></div></section>

      {featured.length > 0 && <section className="featured"><div className="section-head"><div><p className="eyebrow">PARA COMEÇAR</p><h2>Nossos <i>destaques</i></h2></div><button className="text-link" onClick={() => goTo('cardapio')}>Ver todos <ChevronRight size={16}/></button></div><div className="featured-grid">{featured.map(p=><ProductCard key={p.id} p={p} add={add} compact onOpen={setSelectedProduct}/>)}</div></section>}

      <section id="cardapio" className="menu-section"><div className="section-head"><div><p className="eyebrow">NOSSO CARDÁPIO</p><h2>Escolha sua <i>delícia</i></h2><p className="section-subtitle">Encontre seu favorito e adicione ao pedido.</p></div><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar produtos..."/></div></div><div className="menu-layout"><aside className="category-sidebar">{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}<span>{c === 'Todos' ? products.filter(p=>p.available).length : products.filter(p=>p.available && p.category===c).length}</span></button>)}<div className="sidebar-note">Mais do que doces,<br/><i>entregamos felicidade.</i></div></aside><div className="menu-products"><div className="mobile-categories">{categories.map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><div className="product-grid">{filtered.map(p=><ProductCard key={p.id} p={p} add={add} onOpen={setSelectedProduct}/>)}</div>{filtered.length===0 && <div className="empty">Nenhuma delícia encontrada. Tente outra busca. 🍰</div>}</div></div></section>

      <section id="encomendas" className="order-banner"><div><p className="eyebrow">UMA OCASIÃO ESPECIAL?</p><h2>Seu bolo do jeitinho que você <i>sonhou.</i></h2><p>Para bolos personalizados, festas e encomendas maiores, fale diretamente com a Maristela.</p><a className="primary" href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Fazer uma encomenda</a></div><div className="order-cake">🎂</div></section>
      <section id="sobre" className="about"><div className="about-photo"><img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=85"/></div><div><p className="eyebrow">SOBRE A MARISTELA</p><h2>Doces feitos para <i>criar memórias.</i></h2><p>Cada receita é preparada artesanalmente, com aquele cuidado de quem cozinha para pessoas queridas. Aqui, cada encomenda recebe atenção especial do começo ao fim.</p><p className="location"><MapPin size={18}/> Linha Santo Antônio, Vitorino - PR</p></div></section>
    </main>

    <footer><div className="brand"><span className="brand-mark">M</span><span><b>Doces e Delícias</b><small>da Maristela</small></span></div><a href="https://instagram.com/maristelaacker.doces" target="_blank" rel="noreferrer"><Instagram size={18}/> @maristelaacker.doces</a><span>© 2026 Doces e Delícias da Maristela</span></footer>

    <div className="mobile-bottom-nav"><button onClick={()=>goTo('inicio')}><Home size={19}/><span>Início</span></button><button onClick={()=>goTo('cardapio')}><CakeSlice size={19}/><span>Cardápio</span></button><button className="mobile-cart" onClick={()=>setModal('cart')}><ShoppingBag size={19}/>{cartCount > 0 && <b>{cartCount}</b>}<span>Carrinho</span></button><button onClick={()=>setMobileMenu(true)}><MoreHorizontal size={20}/><span>Mais</span></button></div>

    {mobileMenu && <MobileMenu close={()=>setMobileMenu(false)} goTo={goTo} openAdmin={openAdmin} />}
    {selectedProduct && <ProductModal p={selectedProduct} add={add} close={()=>setSelectedProduct(null)} />}
    {modal==='cart' && <Cart cart={cart} setCart={setCart} total={total} checkout={checkout} close={()=>setModal(null)}/>} {admin && session && <Admin products={products} save={save} close={()=>setAdmin(false)} session={session} />}
    {loginOpen && <Login close={()=>setLoginOpen(false)} onSuccess={()=>{setLoginOpen(false);setAdmin(true)}} />}
  </>;
}

function ProductCard({p,add,compact,onOpen}) { const min = Math.max(1, Number(p.minQuantity) || 1); return <article className={'product-card '+(compact?'compact':'')}><div className="product-image-button"><div className="product-img"><img src={p.image} alt={p.name}/>{p.featured && <span>Queridinho</span>}</div></div><div className="product-info"><div className="product-title-button"><p className="product-cat">{p.category}</p><h3>{p.name}</h3></div>{!compact && <p className="product-description">{p.description}</p>}<div className="product-bottom"><div><strong>R$ {p.price.toFixed(2).replace('.', ',')}</strong><small>{p.unit}</small>{min > 1 && <small className="min-order">Mín. {min}</small>}</div><button className="quick-add" onClick={()=>onOpen?.(p)} aria-label={`Adicionar ${p.name}`}><Plus size={18}/><span>Adicionar</span></button></div></div></article> }

function ProductModal({p,add,close}) { const min = Math.max(1, Number(p.minQuantity) || 1); const [qty,setQty]=useState(min); return <div className="overlay product-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="product-modal"><button className="modal-close" onClick={close}><X/></button><img src={p.image} alt={p.name}/><div className="product-modal-content"><p className="product-cat">{p.category}</p><h2>{p.name}</h2><p>{p.description}</p><div className="modal-price"><strong>R$ {p.price.toFixed(2).replace('.', ',')}</strong><small>{p.unit}</small>{min > 1 && <small className="min-order">Pedido mínimo: {min}</small>}</div><div className="modal-actions"><div className="qty"><button onClick={()=>setQty(q=>Math.max(min,q-1))} disabled={qty<=min}><Minus size={15}/></button><span>{qty}</span><button onClick={()=>setQty(q=>q+1)}><Plus size={15}/></button></div><button className="primary modal-add" onClick={()=>{add(p,qty);close()}}>Adicionar ao carrinho</button></div></div></div></div> }

function MobileMenu({close,goTo,openAdmin}) { return <div className="overlay mobile-menu-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><aside className="mobile-menu-drawer"><div className="mobile-menu-head"><div className="brand"><span className="brand-mark">M</span><span><b>Doces e Delícias</b><small>da Maristela</small></span></div><button onClick={close}><X/></button></div><nav className="mobile-nav"><button onClick={()=>goTo('inicio')}><Home/>Início</button><button onClick={()=>goTo('cardapio')}><CakeSlice/>Cardápio</button><button onClick={()=>goTo('sobre')}><Heart/>Sobre</button><button onClick={()=>goTo('encomendas')}><MessageCircle/>Encomendas</button></nav><div className="mobile-menu-category"><b>Categorias</b><button onClick={()=>goTo('cardapio')}>Bolos <ChevronRight/></button><button onClick={()=>goTo('cardapio')}>Doces <ChevronRight/></button><button onClick={()=>goTo('cardapio')}>Kits e Cestas <ChevronRight/></button></div><button className="whatsapp-menu" onClick={()=>window.open(`https://wa.me/${WA}`,'_blank')}><MessageCircle size={18}/> Falar no WhatsApp</button><button className="admin-menu" onClick={openAdmin}><Settings size={17}/> Área da Maristela</button></aside></div> }

function Cart({cart,setCart,total,checkout,close}) { return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="cart-modal"><div className="cart-head"><div><p className="eyebrow">SEU PEDIDO</p><h2>Meu carrinho</h2></div><button className="modal-close" onClick={close}><X/></button></div>{cart.length===0?<div className="empty-cart"><ShoppingBag size={34}/><h3>Seu carrinho está vazio</h3><p>Escolha uma delícia para começar.</p><button className="primary" onClick={close}>Ver cardápio</button></div>:<><div className="cart-list">{cart.map(p=>{const min=Math.max(1,Number(p.minQuantity)||1);return <div className="cart-item" key={p.id}><img src={p.image} alt=""/><div className="cart-item-info"><b>{p.name}</b><small>R$ {p.price.toFixed(2).replace('.', ',')}</small><div className="qty"><button onClick={()=>setCart(c=>c.map(x=>x.id===p.id?{...x,qty:Math.max(min,x.qty-1)}:x))} disabled={p.qty<=min}><Minus size={14}/></button><span>{p.qty}</span><button onClick={()=>setCart(c=>c.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x))}><Plus size={14}/></button></div>{min>1&&<small>Pedido mínimo: {min}</small>}</div><b className="cart-line-total">R$ {(p.price*p.qty).toFixed(2).replace('.', ',')}</b><button className="remove" onClick={()=>setCart(c=>c.filter(x=>x.id!==p.id))}><X size={15}/></button></div>})}</div><div className="cart-summary"><span>Total aproximado</span><strong>R$ {total.toFixed(2).replace('.', ',')}</strong></div><p className="cart-note">O valor final pode variar conforme tamanho e personalização. Confirmaremos tudo pelo WhatsApp.</p><button className="primary checkout" onClick={checkout}><MessageCircle size={18}/> Finalizar pedido no WhatsApp</button></>}</div></div> }

function Login({close,onSuccess}) {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState('');
  const submit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) {
      setError('E-mail ou senha incorretos. Confira os dados e tente novamente.');
      setLoading(false);
      return;
    }
    setLoading(false);
    onSuccess();
  };
  return <div className="overlay auth-overlay" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="auth-card"><button className="modal-close" onClick={close} aria-label="Fechar"><X size={19}/></button><div className="auth-brand"><span className="brand-mark">M</span><span><b>Doces e Delícias</b><small>da Maristela</small></span></div><p className="eyebrow">ÁREA RESTRITA</p><h2 className="auth-title">Entrar no painel</h2><p className="auth-subtitle">Acesse o gerenciamento do cardápio usando sua conta administrativa.</p>{error&&<p className="auth-error">{error}</p>}<form className="auth-form" onSubmit={submit}><label>E-mail<input type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="seu@email.com"/></label><label>Senha<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Sua senha"/></label><button className="primary auth-submit" type="submit" disabled={loading}>{loading?'Entrando...':'Entrar'}</button></form></div></div>
}

function Admin({products,save,close,session}) { const empty={name:'',category:'Bolos',description:'',price:'',unit:'A partir de',minQuantity:'1',image:'',available:true,featured:false}; const [form,setForm]=useState(empty); const [editing,setEditing]=useState(null); const submit=e=>{e.preventDefault();const minQuantity=Math.max(1,Number(form.minQuantity)||1);const item={...form,id:editing??Date.now(),price:Number(form.price),minQuantity};const next=editing?products.map(p=>p.id===editing?item:p):[...products,item];save(next);setForm(empty);setEditing(null)}; const edit=p=>setEditing(p.id)||setForm({...p,minQuantity:Math.max(1,Number(p.minQuantity)||1)}); const logout=async()=>{await supabase.auth.signOut();close()}; return <div className="overlay admin-overlay"><div className="admin-modal"><div className="admin-head"><div><p className="eyebrow">ÁREA DA MARISTELA</p><h2>Gerenciar cardápio</h2></div><button className="modal-close" onClick={close}><X/></button></div><div className="admin-user-bar"><span>Conectado como {session?.user?.email || 'usuário administrativo'}</span><button className="admin-logout" onClick={logout}><LogOut size={13}/> Sair</button></div><form className="admin-form" onSubmit={submit}><div className="form-grid"><label>Nome<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Categoria<select required value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option value="Bolos">Bolos</option><option value="Doces">Doces</option><option value="Kits Festa">Kits Festa</option><option value="Sobremesas">Sobremesas</option><option value="Kits e Cestas">Kits e Cestas</option></select></label><label>Descrição<textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><label>Preço<input required type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></label><label>Unidade<input required value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})}/></label><label>Pedido mínimo<input required type="number" min="1" step="1" value={form.minQuantity} onChange={e=>setForm({...form,minQuantity:e.target.value})}/><small className="field-help">Quantidade mínima deste produto que o cliente precisa adicionar ao pedido.</small></label><label>Imagem (URL)<input value={form.image} onChange={e=>setForm({...form,image:e.target.value})}/></label><label className="check"><input type="checkbox" checked={form.available} onChange={e=>setForm({...form,available:e.target.checked})}/> Disponível</label><label className="check"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Destaque</label></div><div className="admin-form-actions"><button type="button" className="secondary" onClick={()=>{setForm(empty);setEditing(null)}}>Limpar</button><button className="primary" type="submit">{editing?'Salvar alterações':'Adicionar produto'}</button></div></form><div className="admin-list">{products.map(p=><div className="admin-row" key={p.id}><div className="admin-product"><img src={p.image} alt=""/><div><b>{p.name}</b><small>R$ {p.price.toFixed(2).replace('.', ',')} • {p.category}{Math.max(1,Number(p.minQuantity)||1)>1?` • Mín. ${Math.max(1,Number(p.minQuantity)||1)}`:''}</small></div></div><div className="admin-actions"><button onClick={()=>edit(p)} title="Editar"><Pencil size={16}/></button><button onClick={()=>save(products.filter(x=>x.id!==p.id))} title="Excluir"><Trash2 size={16}/></button></div></div>)}</div></div></div> }

createRoot(document.getElementById('root')).render(<App/>);
