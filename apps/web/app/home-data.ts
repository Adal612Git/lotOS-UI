export type InventoryCategory =
  | 'app-route'
  | 'demo'
  | 'component'
  | 'runtime'
  | 'cli-starter'
  | 'premium-asset';

export type InventoryStatus =
  | 'ready'
  | 'live'
  | 'stable'
  | 'alpha'
  | 'preview'
  | 'premium'
  | 'full-only'
  | 'gated';

export type Accent = 'sky' | 'rose' | 'mint' | 'lavender' | 'gold' | 'peach' | 'aqua' | 'green';

export type InventoryItem = {
  id: string;
  name: string;
  category: InventoryCategory;
  status: InventoryStatus;
  description: string;
  simpleValue: string;
  href?: string;
  tags: string[];
  accent: Accent;
};

export type AppRouteItem = {
  path: string;
  name: string;
  group: string;
  description: string;
  simpleValue: string;
  href: string;
  status: InventoryStatus;
  accent: Accent;
};

export type DemoRouteItem = {
  path: string;
  name: string;
  useCase: string;
  description: string;
  comparison?: string;
  href: string;
  accent: Accent;
};

export type ComponentCatalogItem = {
  id: string;
  name: string;
  tier: 'free' | 'pro';
  category: string;
  what: string;
  where: string;
  why: string;
  snippet: string;
  props: string[];
  href: string;
  accent: Accent;
};

export type RuntimeProfileItem = {
  id: string;
  name: string;
  maturity: 'stable' | 'alpha' | 'preview' | 'experimental';
  environment: string;
  support: string;
  idealFor: string;
  href: string;
  accent: Accent;
};

export type CliStarterItem = {
  id: string;
  name: string;
  family: 'stack' | 'desktop';
  stack: string;
  command: string;
  useCase: string;
  startTime: string;
  status: InventoryStatus;
  accent: Accent;
};

export type PremiumAssetItem = {
  id: string;
  name: string;
  group: 'Preview' | 'Admin shell' | 'Layout' | 'Industry kit' | 'Full-only surface';
  unlocks: string;
  audience: string;
  status: 'preview' | 'premium' | 'full-only' | 'gated';
  href?: string;
  accent: Accent;
};

export const appRoutes: AppRouteItem[] = [
  {
    path: '/',
    name: 'Home comercial',
    group: 'Producto',
    description: 'La entrada para explicar que trae LotOS UI y dirigir a demos, precios y premium.',
    simpleValue: 'Sirve para vender el sistema en menos de 30 segundos.',
    href: '/',
    status: 'ready',
    accent: 'peach',
  },
  {
    path: '/admin/entitlements',
    name: 'Admin de accesos',
    group: 'Admin',
    description: 'Superficie para revisar y operar accesos de clientes y planes.',
    simpleValue: 'Ayuda a controlar quien tiene acceso al vault.',
    href: '/admin/entitlements',
    status: 'gated',
    accent: 'lavender',
  },
  {
    path: '/after-purchase',
    name: 'Despues de comprar',
    group: 'Premium',
    description: 'Pagina de handoff para que el comprador sepa que hacer al pagar.',
    simpleValue: 'Reduce friccion despues del checkout.',
    href: '/after-purchase',
    status: 'ready',
    accent: 'mint',
  },
  {
    path: '/ai',
    name: 'Capa AI',
    group: 'AI',
    description: 'Consola que ordena registry, prompts, runtimes y contexto para agentes.',
    simpleValue: 'Le da mapa de producto a humanos y agentes.',
    href: '/ai',
    status: 'ready',
    accent: 'aqua',
  },
  {
    path: '/cancellations',
    name: 'Cancelaciones',
    group: 'Settings',
    description: 'Pagina comercial/legal para explicar cancelaciones sin esconder informacion.',
    simpleValue: 'Hace el producto mas confiable antes de pagar.',
    href: '/cancellations',
    status: 'ready',
    accent: 'gold',
  },
  {
    path: '/checkout/[plan]',
    name: 'Checkout por plan',
    group: 'Premium',
    description: 'Ruta dinamica que lleva a checkout del plan correcto.',
    simpleValue: 'Conecta la decision de compra con pago real.',
    href: '/checkout/pro',
    status: 'gated',
    accent: 'rose',
  },
  {
    path: '/demo',
    name: 'Hub de demos',
    group: 'Demos',
    description: 'Indice navegable para abrir las demos publicas del producto.',
    simpleValue: 'Permite probar antes de comprar.',
    href: '/demo',
    status: 'live',
    accent: 'rose',
  },
  {
    path: '/demo/student-control',
    name: 'Student Control',
    group: 'Demos',
    description: 'Demo flagship academica con alumnos, materias, calificaciones, reportes y metricas.',
    simpleValue: 'Muestra el salto de pantalla generada a superficie de producto.',
    href: '/demo/student-control',
    status: 'live',
    accent: 'aqua',
  },
  {
    path: '/demo/components',
    name: 'Demo de componentes',
    group: 'Demos',
    description: 'Galeria navegable para ver bloques UI en contexto.',
    simpleValue: 'Convierte una lista de componentes en evidencia visual.',
    href: '/demo/components',
    status: 'live',
    accent: 'mint',
  },
  {
    path: '/demo/con-lotos-desktop',
    name: 'Desktop con LotOS',
    group: 'Demos',
    description: 'Ejemplo de app desktop ya ordenada con la superficie LotOS.',
    simpleValue: 'Muestra el salto visual frente a una base cruda.',
    href: '/demo/con-lotos-desktop',
    status: 'live',
    accent: 'lavender',
  },
  {
    path: '/demo/con-lotos-desktop-langs',
    name: 'Desktop multi-lenguaje con LotOS',
    group: 'Demos',
    description: 'Demo desktop que muestra el enfoque multi-runtime y multi-lenguaje.',
    simpleValue: 'Sirve para vender alcance sin perder claridad.',
    href: '/demo/con-lotos-desktop-langs',
    status: 'live',
    accent: 'lavender',
  },
  {
    path: '/demo/con-lotos-hoja',
    name: 'Hoja con LotOS',
    group: 'Demos',
    description: 'Modernizacion visual de spreadsheet con jerarquia, acciones y contexto.',
    simpleValue: 'Hace vendible una hoja operativa sin reescribir todo.',
    href: '/demo/con-lotos-hoja',
    status: 'live',
    accent: 'gold',
  },
  {
    path: '/demo/con-lotos-web',
    name: 'Web con LotOS',
    group: 'Demos',
    description: 'Version con sistema UI aplicado a una superficie web.',
    simpleValue: 'Muestra como se ve una interfaz ya lista para presentar.',
    href: '/demo/con-lotos-web',
    status: 'live',
    accent: 'sky',
  },
  {
    path: '/demo/operator',
    name: 'Operator cockpit',
    group: 'Dashboard',
    description: 'Command room para soporte, riesgo, operaciones o despacho.',
    simpleValue: 'Demuestra densidad sin caos visual.',
    href: '/demo/operator',
    status: 'live',
    accent: 'green',
  },
  {
    path: '/demo/sin-lotos-desktop',
    name: 'Desktop sin LotOS',
    group: 'Demos',
    description: 'Base comparativa para ver como se ve antes de aplicar el sistema.',
    simpleValue: 'Hace evidente el antes/despues.',
    href: '/demo/sin-lotos-desktop',
    status: 'live',
    accent: 'lavender',
  },
  {
    path: '/demo/sin-lotos-desktop-langs',
    name: 'Desktop multi-lenguaje sin LotOS',
    group: 'Demos',
    description: 'Comparativo crudo para el caso desktop multi-lenguaje.',
    simpleValue: 'Ayuda a explicar el valor visual del sistema.',
    href: '/demo/sin-lotos-desktop-langs',
    status: 'live',
    accent: 'lavender',
  },
  {
    path: '/demo/sin-lotos-hoja',
    name: 'Hoja sin LotOS',
    group: 'Demos',
    description: 'Version base de hoja operativa antes de modernizarla.',
    simpleValue: 'Da contexto claro al upgrade.',
    href: '/demo/sin-lotos-hoja',
    status: 'live',
    accent: 'gold',
  },
  {
    path: '/demo/sin-lotos-web',
    name: 'Web sin LotOS',
    group: 'Demos',
    description: 'Base web sencilla para comparar contra la version con sistema UI.',
    simpleValue: 'Permite ver el salto sin discurso largo.',
    href: '/demo/sin-lotos-web',
    status: 'live',
    accent: 'sky',
  },
  {
    path: '/demo/vault',
    name: 'Demo vault',
    group: 'Premium',
    description: 'Vista publica de como se presenta el valor protegido.',
    simpleValue: 'Enseña premium sin regalar todo el payload.',
    href: '/demo/vault',
    status: 'live',
    accent: 'peach',
  },
  {
    path: '/design-lab',
    name: 'Laboratorio de diseno',
    group: 'Producto',
    description: 'Espacio para probar direccion visual, tokens y patrones de UI.',
    simpleValue: 'Ayuda a explorar antes de cerrar una version final.',
    href: '/design-lab',
    status: 'ready',
    accent: 'rose',
  },
  {
    path: '/estrategia',
    name: 'Estrategia',
    group: 'Docs/Delivery',
    description: 'Superficie para explicar posicionamiento, alcance y ruta comercial.',
    simpleValue: 'Ordena la narrativa para compradores.',
    href: '/estrategia',
    status: 'ready',
    accent: 'peach',
  },
  {
    path: '/examples',
    name: 'Ejemplos',
    group: 'Producto',
    description: 'Galeria de escenarios de entrega como dashboards, vaults y modernization.',
    simpleValue: 'Muestra casos concretos, no promesas.',
    href: '/examples',
    status: 'ready',
    accent: 'sky',
  },
  {
    path: '/login',
    name: 'Login',
    group: 'Settings',
    description: 'Entrada para compradores y operadores con acceso privado.',
    simpleValue: 'Separa lo publico de lo protegido.',
    href: '/login',
    status: 'ready',
    accent: 'mint',
  },
  {
    path: '/manage-subscription',
    name: 'Administrar suscripcion',
    group: 'Settings',
    description: 'Ruta para gestionar la relacion post-compra.',
    simpleValue: 'Da confianza porque el comprador ve salida y control.',
    href: '/manage-subscription',
    status: 'ready',
    accent: 'gold',
  },
  {
    path: '/multi-framework',
    name: 'Matriz de runtimes',
    group: 'Runtimes',
    description: 'Mapa de madurez para React, backend, desktop y tracks experimentales.',
    simpleValue: 'Convierte roadmap en plataforma entendible.',
    href: '/multi-framework',
    status: 'ready',
    accent: 'lavender',
  },
  {
    path: '/playground',
    name: 'Playground',
    group: 'Producto',
    description: 'Lugar para inspeccionar componentes y comparar patrones.',
    simpleValue: 'Permite tocar el sistema antes de comprar.',
    href: '/playground',
    status: 'ready',
    accent: 'mint',
  },
  {
    path: '/pricing',
    name: 'Precios',
    group: 'Premium',
    description: 'Escalera comercial para Solo, Pro y Full Signature.',
    simpleValue: 'Hace claro que desbloquea cada capa.',
    href: '/pricing',
    status: 'ready',
    accent: 'rose',
  },
  {
    path: '/privacy',
    name: 'Privacidad',
    group: 'Settings',
    description: 'Politica de privacidad para compra, acceso digital y soporte.',
    simpleValue: 'Cubre confianza basica de producto pagado.',
    href: '/privacy',
    status: 'ready',
    accent: 'sky',
  },
  {
    path: '/provider',
    name: 'Proveedor',
    group: 'Docs/Delivery',
    description: 'Pagina para explicar informacion del proveedor y canal de soporte.',
    simpleValue: 'Ayuda a compradores a validar quien entrega.',
    href: '/provider',
    status: 'ready',
    accent: 'aqua',
  },
  {
    path: '/refunds',
    name: 'Reembolsos',
    group: 'Settings',
    description: 'Reglas de reembolso para acceso digital y assets privados.',
    simpleValue: 'Evita incertidumbre antes de pagar.',
    href: '/refunds',
    status: 'ready',
    accent: 'gold',
  },
  {
    path: '/support',
    name: 'Soporte',
    group: 'Settings',
    description: 'Ruta para pedir ayuda o hablar de entrega comercial.',
    simpleValue: 'Da salida humana cuando el comprador tiene dudas.',
    href: '/support',
    status: 'ready',
    accent: 'green',
  },
  {
    path: '/templates',
    name: 'Templates',
    group: 'Templates',
    description: 'Catalogo de starters, prompts, checklists y superficies de entrega.',
    simpleValue: 'Acelera el arranque sin inventar estructura.',
    href: '/templates',
    status: 'ready',
    accent: 'gold',
  },
  {
    path: '/terms',
    name: 'Terminos',
    group: 'Settings',
    description: 'Condiciones de compra, acceso digital y uso de assets.',
    simpleValue: 'Hace formal el producto sin esconder letra chica.',
    href: '/terms',
    status: 'ready',
    accent: 'sky',
  },
  {
    path: '/vault',
    name: 'Vault',
    group: 'Premium',
    description: 'Entrada a la capa protegida segun el acceso del comprador.',
    simpleValue: 'Presenta el valor privado sin mezclarlo con la capa publica.',
    href: '/vault',
    status: 'gated',
    accent: 'peach',
  },
  {
    path: '/vault/launch',
    name: 'Vault Full Signature',
    group: 'Premium',
    description: 'Ruta de mayor acabado para assets Full-only y handoff ejecutivo.',
    simpleValue: 'Hace que Full se sienta como suite completa.',
    href: '/vault/launch',
    status: 'full-only',
    accent: 'peach',
  },
  {
    path: '/vault/pro',
    name: 'Vault Pro',
    group: 'Premium',
    description: 'Zona protegida para assets de entrega reutilizables.',
    simpleValue: 'Da peso real al tier de trabajo serio.',
    href: '/vault/pro',
    status: 'premium',
    accent: 'rose',
  },
  {
    path: '/vault/solo',
    name: 'Vault Solo',
    group: 'Premium',
    description: 'Primer acceso privado para validar el valor pagado.',
    simpleValue: 'Convierte interes en prueba privada.',
    href: '/vault/solo',
    status: 'premium',
    accent: 'mint',
  },
];

export const demoRoutes: DemoRouteItem[] = [
  {
    path: '/demo/student-control',
    name: 'Student Control',
    useCase: 'Sistema academico con datos, reportes y superficie de entrega.',
    description: 'La demo flagship para ver formularios, filtros, metricas, graficas y before/after.',
    comparison: 'Contrasta output crudo contra LotOS Product Surface.',
    href: '/demo/student-control',
    accent: 'aqua',
  },
  {
    path: '/demo',
    name: 'Demo wall',
    useCase: 'Vista central para navegar todas las pruebas.',
    description: 'El comprador puede abrir el sistema y moverse por demos reales.',
    comparison: 'Antes era una promesa. Ahora se puede abrir.',
    href: '/demo',
    accent: 'rose',
  },
  {
    path: '/demo/components',
    name: 'Component gallery',
    useCase: 'Validar bloques UI sin leer documentacion larga.',
    description: 'Muestra componentes en contexto de producto.',
    href: '/demo/components',
    accent: 'mint',
  },
  {
    path: '/demo/operator',
    name: 'Operator cockpit',
    useCase: 'Soporte, riesgo, despacho y operaciones.',
    description: 'Dashboard denso con jerarquia clara, alertas y acciones.',
    href: '/demo/operator',
    accent: 'green',
  },
  {
    path: '/demo/vault',
    name: 'Vault demo',
    useCase: 'Ensenar premium sin abrir los assets privados.',
    description: 'Presenta la diferencia entre capa publica y capa protegida.',
    href: '/demo/vault',
    accent: 'peach',
  },
  {
    path: '/demo/con-lotos-web',
    name: 'Web con LotOS',
    useCase: 'Mostrar una web ya organizada con sistema UI.',
    description: 'Patrones de navegacion, estados y layout con acabado comercial.',
    comparison: 'Comparar contra /demo/sin-lotos-web.',
    href: '/demo/con-lotos-web',
    accent: 'sky',
  },
  {
    path: '/demo/sin-lotos-web',
    name: 'Web sin LotOS',
    useCase: 'Mostrar el punto de partida crudo.',
    description: 'Sirve como contraste para explicar el valor del sistema.',
    href: '/demo/sin-lotos-web',
    accent: 'sky',
  },
  {
    path: '/demo/con-lotos-hoja',
    name: 'Hoja con LotOS',
    useCase: 'Modernizacion de spreadsheets operativos.',
    description: 'Convierte una hoja en superficie de comando con mejor percepcion.',
    comparison: 'Comparar contra /demo/sin-lotos-hoja.',
    href: '/demo/con-lotos-hoja',
    accent: 'gold',
  },
  {
    path: '/demo/sin-lotos-hoja',
    name: 'Hoja sin LotOS',
    useCase: 'Estado base de una hoja antes de modernizar.',
    description: 'Deja claro que el valor no es inventado.',
    href: '/demo/sin-lotos-hoja',
    accent: 'gold',
  },
  {
    path: '/demo/con-lotos-desktop',
    name: 'Desktop con LotOS',
    useCase: 'Desktop shell con lenguaje visual consistente.',
    description: 'Muestra que LotOS tambien puede vestir herramientas internas.',
    comparison: 'Comparar contra /demo/sin-lotos-desktop.',
    href: '/demo/con-lotos-desktop',
    accent: 'lavender',
  },
  {
    path: '/demo/sin-lotos-desktop',
    name: 'Desktop sin LotOS',
    useCase: 'Base visual antes de aplicar el sistema.',
    description: 'Hace visible el upgrade sin explicarlo de mas.',
    href: '/demo/sin-lotos-desktop',
    accent: 'lavender',
  },
  {
    path: '/demo/con-lotos-desktop-langs',
    name: 'Desktop multi-lenguaje con LotOS',
    useCase: 'Demostrar alcance cross-runtime.',
    description: 'Presenta una experiencia consistente entre lenguajes.',
    comparison: 'Comparar contra /demo/sin-lotos-desktop-langs.',
    href: '/demo/con-lotos-desktop-langs',
    accent: 'aqua',
  },
  {
    path: '/demo/sin-lotos-desktop-langs',
    name: 'Desktop multi-lenguaje sin LotOS',
    useCase: 'Comparativo de base multi-lenguaje.',
    description: 'Da contexto antes de mostrar el upgrade.',
    href: '/demo/sin-lotos-desktop-langs',
    accent: 'aqua',
  },
];

export const componentCatalog: ComponentCatalogItem[] = [
  {
    id: 'accordion',
    name: 'Accordion',
    tier: 'pro',
    category: 'Disclosure',
    what: 'Abre y cierra secciones de informacion sin saturar la pantalla.',
    where: 'FAQ, settings, docs, detalles de planes y checklists.',
    why: 'Hace que una pagina larga se sienta ordenada.',
    snippet: '<Accordion items={planQuestions} />',
    props: ['items', 'defaultOpen', 'onChange'],
    href: '/demo/components',
    accent: 'lavender',
  },
  {
    id: 'alert',
    name: 'Alert',
    tier: 'free',
    category: 'Feedback',
    what: 'Muestra un aviso importante con tono claro.',
    where: 'Errores de checkout, permisos, estados de API y mensajes de seguridad.',
    why: 'Evita que el usuario pierda contexto cuando algo cambia.',
    snippet: '<Alert tone="warning">Pago pendiente</Alert>',
    props: ['tone', 'title', 'children'],
    href: '/demo/components',
    accent: 'rose',
  },
  {
    id: 'avatar',
    name: 'Avatar',
    tier: 'pro',
    category: 'Identity',
    what: 'Representa usuarios, equipos o responsables.',
    where: 'Admin panels, comentarios, colas de soporte y actividad reciente.',
    why: 'Le pone cara humana a superficies operativas.',
    snippet: '<Avatar name="Ana Torres" />',
    props: ['name', 'src', 'status'],
    href: '/demo/components',
    accent: 'peach',
  },
  {
    id: 'badge',
    name: 'Badge',
    tier: 'free',
    category: 'Status',
    what: 'Etiqueta estados, tiers, categorias y madurez.',
    where: 'Runtimes, precios, cards de inventario y filas de tabla.',
    why: 'Hace escaneable una interfaz tecnica.',
    snippet: '<Badge tone="success">Live demo</Badge>',
    props: ['tone', 'size', 'children'],
    href: '/demo/components',
    accent: 'mint',
  },
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    tier: 'pro',
    category: 'Navigation',
    what: 'Muestra donde esta el usuario dentro de una superficie.',
    where: 'Docs, vault, admin y catalogos con niveles.',
    why: 'Reduce perdida de contexto en productos grandes.',
    snippet: '<Breadcrumbs items={trail} />',
    props: ['items', 'separator'],
    href: '/demo/components',
    accent: 'sky',
  },
  {
    id: 'button',
    name: 'Button',
    tier: 'free',
    category: 'Action',
    what: 'Dispara acciones principales y secundarias.',
    where: 'Checkout, filtros, formularios, nav y toolbars.',
    why: 'Define la energia de la interfaz y sus jerarquias.',
    snippet: '<Button variant="primary">Abrir demo</Button>',
    props: ['variant', 'size', 'disabled'],
    href: '/demo/components',
    accent: 'rose',
  },
  {
    id: 'card',
    name: 'Card',
    tier: 'free',
    category: 'Layout',
    what: 'Agrupa informacion en una unidad clara.',
    where: 'Metricas, assets, templates, planes y resumenes.',
    why: 'Permite construir dashboards sin inventar estructura.',
    snippet: '<Card title="Assets premium" />',
    props: ['title', 'padding', 'tone'],
    href: '/demo/components',
    accent: 'peach',
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    tier: 'pro',
    category: 'Forms',
    what: 'Captura seleccion multiple o confirmacion.',
    where: 'Permisos, filtros, onboarding y listas de tareas.',
    why: 'Hace que flujos densos sigan siendo claros.',
    snippet: '<Checkbox label="Incluir assets Full" />',
    props: ['checked', 'label', 'onChange'],
    href: '/demo/components',
    accent: 'mint',
  },
  {
    id: 'combobox',
    name: 'Combobox',
    tier: 'pro',
    category: 'Forms',
    what: 'Busca y selecciona una opcion de una lista grande.',
    where: 'Clientes, runtimes, componentes, industrias y planes.',
    why: 'Evita dropdowns imposibles de navegar.',
    snippet: '<Combobox options={runtimes} />',
    props: ['options', 'value', 'placeholder'],
    href: '/demo/components',
    accent: 'aqua',
  },
  {
    id: 'divider',
    name: 'Divider',
    tier: 'free',
    category: 'Layout',
    what: 'Separa grupos visuales sin ruido.',
    where: 'Sidebars, cards, listas, formularios y docs.',
    why: 'Da respiracion a pantallas con mucha informacion.',
    snippet: '<Divider label="Premium" />',
    props: ['label', 'orientation'],
    href: '/demo/components',
    accent: 'sky',
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    tier: 'pro',
    category: 'Action',
    what: 'Agrupa acciones secundarias en un menu compacto.',
    where: 'Tablas, cards, perfiles, vault y admin.',
    why: 'Mantiene la interfaz limpia sin esconder acciones clave.',
    snippet: '<Dropdown items={assetActions} />',
    props: ['items', 'align', 'trigger'],
    href: '/demo/components',
    accent: 'lavender',
  },
  {
    id: 'empty-state',
    name: 'Empty State',
    tier: 'free',
    category: 'Feedback',
    what: 'Explica que pasa cuando no hay datos.',
    where: 'Busquedas, tablas, filtros, vault y listas nuevas.',
    why: 'Convierte pantallas vacias en pasos claros.',
    snippet: '<EmptyState title="Sin resultados" />',
    props: ['title', 'description', 'action'],
    href: '/demo/components',
    accent: 'gold',
  },
  {
    id: 'form',
    name: 'Form',
    tier: 'pro',
    category: 'Forms',
    what: 'Estructura captura de datos con labels, ayudas y errores.',
    where: 'Checkout manual, soporte, admin y configuracion.',
    why: 'Evita formularios improvisados y dificiles de completar.',
    snippet: '<Form fields={checkoutFields} />',
    props: ['fields', 'onSubmit', 'errors'],
    href: '/demo/components',
    accent: 'mint',
  },
  {
    id: 'input',
    name: 'Input',
    tier: 'free',
    category: 'Forms',
    what: 'Campo base para texto, busqueda y datos simples.',
    where: 'Search, login, filtros, forms y comandos.',
    why: 'Es una pieza pequena que define calidad percibida.',
    snippet: '<Input placeholder="Buscar componente" />',
    props: ['value', 'placeholder', 'error'],
    href: '/demo/components',
    accent: 'aqua',
  },
  {
    id: 'modal',
    name: 'Modal',
    tier: 'pro',
    category: 'Overlay',
    what: 'Abre una decision o detalle sin salir del flujo.',
    where: 'Confirmaciones, previews, permisos y upgrade prompts.',
    why: 'Mantiene foco cuando la accion importa.',
    snippet: '<Modal title="Confirmar acceso" />',
    props: ['open', 'title', 'onClose'],
    href: '/demo/components',
    accent: 'rose',
  },
  {
    id: 'progress',
    name: 'Progress',
    tier: 'pro',
    category: 'Feedback',
    what: 'Muestra avance de tareas, onboarding o verificaciones.',
    where: 'Deploy, importaciones, setup, readiness y checklists.',
    why: 'Ayuda a entender cuanto falta.',
    snippet: '<Progress value={72} label="Ready" />',
    props: ['value', 'max', 'label'],
    href: '/demo/components',
    accent: 'green',
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    tier: 'pro',
    category: 'Forms',
    what: 'Permite elegir una opcion entre varias.',
    where: 'Planes, runtimes, modos de entrega y filtros.',
    why: 'Hace explicita una decision.',
    snippet: '<RadioGroup options={plans} />',
    props: ['options', 'value', 'name'],
    href: '/demo/components',
    accent: 'gold',
  },
  {
    id: 'select',
    name: 'Select',
    tier: 'pro',
    category: 'Forms',
    what: 'Elige una opcion compacta.',
    where: 'Filtros por estado, runtime, categoria o plan.',
    why: 'Reduce espacio cuando la lista es corta.',
    snippet: '<Select options={tiers} />',
    props: ['options', 'value', 'placeholder'],
    href: '/demo/components',
    accent: 'sky',
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    tier: 'pro',
    category: 'Feedback',
    what: 'Muestra estructura mientras carga contenido.',
    where: 'Dashboards, tablas, cards y previews.',
    why: 'Hace que la espera se sienta controlada.',
    snippet: '<Skeleton rows={3} />',
    props: ['rows', 'shape', 'animated'],
    href: '/demo/components',
    accent: 'lavender',
  },
  {
    id: 'spinner',
    name: 'Spinner',
    tier: 'free',
    category: 'Feedback',
    what: 'Indica carga rapida o accion en proceso.',
    where: 'Botones, fetches, checkout y cambios de estado.',
    why: 'Evita clicks repetidos y dudas.',
    snippet: '<Spinner label="Cargando" />',
    props: ['size', 'label'],
    href: '/demo/components',
    accent: 'aqua',
  },
  {
    id: 'stat',
    name: 'Stat',
    tier: 'pro',
    category: 'Data',
    what: 'Muestra una metrica importante con contexto.',
    where: 'Dashboards, reportes, pricing y resumen ejecutivo.',
    why: 'Ayuda a entender el estado del negocio rapido.',
    snippet: '<Stat label="Demos" value="12" />',
    props: ['label', 'value', 'helperText'],
    href: '/demo/components',
    accent: 'green',
  },
  {
    id: 'switch',
    name: 'Switch',
    tier: 'pro',
    category: 'Forms',
    what: 'Activa o desactiva un estado binario.',
    where: 'Permisos, preferencias, flags y settings.',
    why: 'Hace que un cambio simple se entienda al instante.',
    snippet: '<Switch label="Modo premium" />',
    props: ['checked', 'label', 'onChange'],
    href: '/demo/components',
    accent: 'mint',
  },
  {
    id: 'table',
    name: 'Table',
    tier: 'pro',
    category: 'Data',
    what: 'Organiza datos en filas, estados y acciones.',
    where: 'Admin, inventario, clientes, logs y operaciones.',
    why: 'Es clave para productos internos serios.',
    snippet: '<Table rows={assets} columns={columns} />',
    props: ['rows', 'columns', 'emptyState'],
    href: '/demo/components',
    accent: 'sky',
  },
  {
    id: 'tabs',
    name: 'Tabs',
    tier: 'pro',
    category: 'Navigation',
    what: 'Divide contenido relacionado en vistas pequenas.',
    where: 'Catalogos, settings, docs, vault y playground.',
    why: 'Permite explorar sin cargar otra pagina.',
    snippet: '<Tabs items={catalogSections} />',
    props: ['items', 'defaultValue', 'onChange'],
    href: '/demo/components',
    accent: 'lavender',
  },
  {
    id: 'textarea',
    name: 'Textarea',
    tier: 'pro',
    category: 'Forms',
    what: 'Captura notas, prompts, feedback o instrucciones largas.',
    where: 'AI console, soporte, briefs y configuracion.',
    why: 'Hace utiles los flujos con texto real.',
    snippet: '<Textarea placeholder="Describe el caso" />',
    props: ['value', 'placeholder', 'rows'],
    href: '/demo/components',
    accent: 'peach',
  },
  {
    id: 'toast',
    name: 'Toast',
    tier: 'pro',
    category: 'Feedback',
    what: 'Confirma acciones sin interrumpir el flujo.',
    where: 'Copiar comando, guardar settings, actualizar acceso.',
    why: 'Da feedback rapido sin meter modales innecesarios.',
    snippet: '<Toast title="Comando copiado" />',
    props: ['title', 'tone', 'duration'],
    href: '/demo/components',
    accent: 'rose',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    tier: 'pro',
    category: 'Help',
    what: 'Da ayuda corta justo donde se necesita.',
    where: 'Iconos, estados, acciones peligrosas y metricas.',
    why: 'Reduce dudas sin llenar la UI de texto.',
    snippet: '<Tooltip content="Full-only asset" />',
    props: ['content', 'side', 'children'],
    href: '/demo/components',
    accent: 'gold',
  },
];

export const runtimeProfiles: RuntimeProfileItem[] = [
  { id: 'react', name: 'React', maturity: 'stable', environment: 'SPA / SSR', support: 'Production arm', idealFor: 'Productos web listos para lanzar.', href: '/multi-framework', accent: 'sky' },
  { id: 'vue', name: 'Vue 3', maturity: 'preview', environment: 'SPA', support: 'Web components bridge', idealFor: 'Equipos Vue que quieren reutilizar primitivas.', href: '/multi-framework', accent: 'green' },
  { id: 'svelte', name: 'Svelte', maturity: 'preview', environment: 'SPA', support: 'Web components bridge', idealFor: 'Interfaces ligeras con wrapper minimo.', href: '/multi-framework', accent: 'peach' },
  { id: 'angular', name: 'Angular', maturity: 'preview', environment: 'SPA', support: 'Typed adapter lane', idealFor: 'Entornos enterprise con inputs y outputs claros.', href: '/multi-framework', accent: 'rose' },
  { id: 'php-laravel', name: 'Laravel Blade/Livewire', maturity: 'alpha', environment: 'Server templates', support: 'Starter + contracts', idealFor: 'Dashboards internos en equipos PHP.', href: '/multi-framework', accent: 'gold' },
  { id: 'python-django', name: 'Django Templates', maturity: 'alpha', environment: 'Server templates', support: 'Starter + validator', idealFor: 'Admin panels y operaciones Python.', href: '/multi-framework', accent: 'green' },
  { id: 'python-flask', name: 'Flask/Jinja', maturity: 'alpha', environment: 'Server templates', support: 'Lean starter', idealFor: 'Herramientas internas pequenas.', href: '/multi-framework', accent: 'aqua' },
  { id: 'python-pyside', name: 'Python + PySide', maturity: 'alpha', environment: 'Desktop webview', support: 'Desktop shell', idealFor: 'Apps desktop con puente JS.', href: '/multi-framework', accent: 'lavender' },
  { id: 'java-spring', name: 'Spring + Thymeleaf', maturity: 'alpha', environment: 'Server templates', support: 'Enterprise starter', idealFor: 'Equipos Java con auditoria y estructura.', href: '/multi-framework', accent: 'gold' },
  { id: 'java-javafx', name: 'Java + JavaFX', maturity: 'alpha', environment: 'Desktop webview', support: 'Desktop shell', idealFor: 'Desktop Java con UI embebida.', href: '/multi-framework', accent: 'lavender' },
  { id: 'dotnet-razor', name: '.NET Razor', maturity: 'alpha', environment: 'Server templates', support: 'Razor starter', idealFor: 'Formularios y dashboards .NET.', href: '/multi-framework', accent: 'sky' },
  { id: 'go-templ', name: 'Go + templ', maturity: 'alpha', environment: 'Server templates', support: 'Go starter', idealFor: 'Dashboards API-heavy con bajo JS.', href: '/multi-framework', accent: 'aqua' },
  { id: 'rust-tauri', name: 'Rust + Tauri', maturity: 'alpha', environment: 'Desktop webview', support: 'Desktop target', idealFor: 'Apps desktop seguras con capacidades nativas.', href: '/multi-framework', accent: 'rose' },
  { id: 'c-ncurses', name: 'C + ncurses', maturity: 'preview', environment: 'Terminal', support: 'Terminal lane', idealFor: 'Ambientes sin render web.', href: '/multi-framework', accent: 'green' },
  { id: 'c-webview', name: 'C + WebView', maturity: 'alpha', environment: 'Desktop webview', support: 'Native shell', idealFor: 'Deployments ligeros y embebidos.', href: '/multi-framework', accent: 'peach' },
  { id: 'cpp-qt', name: 'C++ + Qt', maturity: 'preview', environment: 'Desktop native', support: 'Token bridge', idealFor: 'Herramientas nativas con marca consistente.', href: '/multi-framework', accent: 'lavender' },
  { id: 'cpp-webview', name: 'C++ + WebView', maturity: 'alpha', environment: 'Desktop webview', support: 'Native shell', idealFor: 'Desktop de alto rendimiento con UI web.', href: '/multi-framework', accent: 'sky' },
  { id: 'cpp-imgui', name: 'C++ + ImGui', maturity: 'preview', environment: 'Terminal / tooling', support: 'Tooling lane', idealFor: 'Herramientas tecnicas de iteracion rapida.', href: '/multi-framework', accent: 'gold' },
  { id: 'mojo-experimental', name: 'Mojo', maturity: 'experimental', environment: 'Terminal / hybrid', support: 'Experimental track', idealFor: 'Exploracion futura sin prometer madurez.', href: '/multi-framework', accent: 'rose' },
];

export const cliStarters: CliStarterItem[] = [
  { id: 'php-laravel-starter', name: 'PHP Laravel Starter', family: 'stack', stack: 'PHP / Laravel', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s php-laravel-starter -d mongodb -o stack/php-laravel', useCase: 'Dashboard server-rendered con opcion Mongo.', startTime: '10 min', status: 'alpha', accent: 'gold' },
  { id: 'python-django-starter', name: 'Python Django Starter', family: 'stack', stack: 'Python / Django', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s python-django-starter -d mongodb -o stack/python-django', useCase: 'Admin panel con templates y capa de servicio.', startTime: '10 min', status: 'alpha', accent: 'green' },
  { id: 'python-flask-starter', name: 'Python Flask Starter', family: 'stack', stack: 'Python / Flask', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s python-flask-starter -d mongodb -o stack/python-flask', useCase: 'Herramienta interna ligera.', startTime: '8 min', status: 'alpha', accent: 'aqua' },
  { id: 'java-spring-starter', name: 'Java Spring Starter', family: 'stack', stack: 'Java / Spring', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s java-spring-starter -d mongodb -o stack/java-spring', useCase: 'Dashboard enterprise con estructura audit-friendly.', startTime: '12 min', status: 'alpha', accent: 'gold' },
  { id: 'dotnet-razor-starter', name: '.NET Razor Starter', family: 'stack', stack: '.NET / Razor', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s dotnet-razor-starter -d mongodb -o stack/dotnet-razor', useCase: 'Razor Pages con contratos y formularios.', startTime: '12 min', status: 'alpha', accent: 'sky' },
  { id: 'go-templ-starter', name: 'Go templ Starter', family: 'stack', stack: 'Go / templ', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s go-templ-starter -d mongodb -o stack/go-templ', useCase: 'UI server-side para dashboards API-heavy.', startTime: '10 min', status: 'alpha', accent: 'aqua' },
  { id: 'python-pyside-desktop', name: 'Python PySide Desktop Starter', family: 'stack', stack: 'Python / PySide', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s python-pyside-desktop -o stack/python-pyside', useCase: 'Desktop shell para equipos Python.', startTime: '12 min', status: 'alpha', accent: 'lavender' },
  { id: 'java-javafx-desktop', name: 'Java JavaFX Desktop Starter', family: 'stack', stack: 'Java / JavaFX', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s java-javafx-desktop -o stack/java-javafx', useCase: 'Desktop Java con UI embebida.', startTime: '12 min', status: 'alpha', accent: 'lavender' },
  { id: 'c-webview-desktop', name: 'C WebView Desktop Starter', family: 'stack', stack: 'C / WebView', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s c-webview-desktop -o stack/c-webview', useCase: 'Shell nativo ligero para escritorio.', startTime: '8 min', status: 'alpha', accent: 'peach' },
  { id: 'cpp-webview-desktop', name: 'C++ WebView Desktop Starter', family: 'stack', stack: 'C++ / WebView', command: 'pnpm --filter @lotosui/cli exec lotos-ui stack-init -s cpp-webview-desktop -o stack/cpp-webview', useCase: 'Desktop de alto rendimiento con UI web.', startTime: '8 min', status: 'alpha', accent: 'sky' },
  { id: 'control-center-desktop', name: 'Control Center Desktop', family: 'desktop', stack: 'Desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t control-center-desktop -o desktop/control-center', useCase: 'KPI rail, command panel y activity feed.', startTime: '6 min', status: 'ready', accent: 'sky' },
  { id: 'incident-war-room', name: 'Incident War Room', family: 'desktop', stack: 'Desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l rust -t incident-war-room -o desktop/incident-war-room', useCase: 'Timeline de incidentes y runbook pane.', startTime: '6 min', status: 'ready', accent: 'rose' },
  { id: 'workflow-studio', name: 'Workflow Studio', family: 'desktop', stack: 'Desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l java -t workflow-studio -o desktop/workflow-studio', useCase: 'Kanban operativo con inspector editable.', startTime: '6 min', status: 'ready', accent: 'mint' },
  { id: 'data-command-console', name: 'Data Command Console', family: 'desktop', stack: 'Desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l cpp -t data-command-console -o desktop/data-command-console', useCase: 'Tabla densa, filtros y detail drawer.', startTime: '6 min', status: 'ready', accent: 'aqua' },
  { id: 'executive-briefing-suite', name: 'Executive Briefing Suite', family: 'desktop', stack: 'Pro desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t executive-briefing-suite -o desktop/executive-briefing', useCase: 'Narrativa KPI para founders y boardroom.', startTime: '7 min', status: 'premium', accent: 'lavender' },
  { id: 'finance-ops-atlas', name: 'Finance Ops Atlas', family: 'desktop', stack: 'Pro desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l rust -t finance-ops-atlas -o desktop/finance-ops', useCase: 'Cockpit financiero con alertas y variacion.', startTime: '7 min', status: 'premium', accent: 'gold' },
  { id: 'industrial-command-surface', name: 'Industrial Command Surface', family: 'desktop', stack: 'Pro desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l c -t industrial-command-surface -o desktop/industrial-command', useCase: 'Monitoreo de estaciones, alarmas y control.', startTime: '7 min', status: 'premium', accent: 'green' },
  { id: 'ai-orchestrator-desk', name: 'AI Orchestrator Desk', family: 'desktop', stack: 'Pro desktop template', command: 'pnpm --filter @lotosui/cli exec lotos-ui desktop-init -l python -t ai-orchestrator-desk -o desktop/ai-orchestrator', useCase: 'Colas de agentes, trazas y controles de ejecucion.', startTime: '7 min', status: 'premium', accent: 'peach' },
];

export const premiumAssets: PremiumAssetItem[] = [
  { id: 'excel-lotus-grid-preview', name: 'Excel Lotus Grid Preview', group: 'Preview', unlocks: 'Una hoja se ve como superficie de comando con KPI ribbon y filtros.', audience: 'Equipos que viven en Excel y necesitan vender modernizacion.', status: 'preview', href: '/demo/vault', accent: 'gold' },
  { id: 'openoffice-calc-command-preview', name: 'OpenOffice Calc Command Preview', group: 'Preview', unlocks: 'Modernizacion visual para Calc sin migracion forzada.', audience: 'Operaciones fuera del stack Microsoft.', status: 'preview', href: '/demo/vault', accent: 'green' },
  { id: 'license-matrix', name: 'License Matrix', group: 'Preview', unlocks: 'Comparacion clara de acceso, entrega y reglas de compra.', audience: 'Compradores que necesitan decidir tier.', status: 'preview', href: '/pricing', accent: 'sky' },
  { id: 'sales-preview', name: 'Sales Preview Surface', group: 'Preview', unlocks: 'Pagina comercial para explicar que desbloquea la capa privada.', audience: 'Founders y agencias que necesitan ensenar valor antes del cierre.', status: 'preview', href: '/demo/vault', accent: 'rose' },
  { id: 'dashboard-shell', name: 'Dashboard Shell', group: 'Admin shell', unlocks: 'Base visual para paneles internos con navegacion, estados y layout premium.', audience: 'Equipos que venden admin panels o productos internos.', status: 'premium', href: '/vault/pro', accent: 'mint' },
  { id: 'executive-briefing-layout', name: 'Executive Briefing Layout', group: 'Layout', unlocks: 'Narrativa KPI para updates, inversores y board-facing reviews.', audience: 'Founders, PMs y equipos con reportes ejecutivos.', status: 'premium', href: '/vault/pro', accent: 'lavender' },
  { id: 'operator-triad-layout', name: 'Operator Triad Layout', group: 'Layout', unlocks: 'Layout de tres zonas: senal, cola y accion.', audience: 'Soporte, riesgo, operaciones y despacho.', status: 'premium', href: '/vault/pro', accent: 'aqua' },
  { id: 'finance-ops-kit', name: 'Finance Ops Kit', group: 'Industry kit', unlocks: 'Patrones para variacion, aprobaciones y revision financiera.', audience: 'Finanzas internas y agencias con clientes B2B.', status: 'premium', href: '/vault/pro', accent: 'gold' },
  { id: 'health-ops-kit', name: 'Health Ops Kit', group: 'Industry kit', unlocks: 'Superficies de alta confianza para seguimiento operativo.', audience: 'Equipos de salud, clinicas y operaciones reguladas.', status: 'premium', href: '/vault/pro', accent: 'green' },
  { id: 'excel-lotus-grid-kit', name: 'Excel Lotus Grid Kit', group: 'Industry kit', unlocks: 'Kit reutilizable para transformar trabajo repetido de Excel.', audience: 'Equipos que venden spreadsheet modernization.', status: 'premium', href: '/vault/pro', accent: 'gold' },
  { id: 'openoffice-calc-command-kit', name: 'OpenOffice Calc Command Kit', group: 'Industry kit', unlocks: 'Patrones de comando para Calc con jerarquia LotOS.', audience: 'Equipos con hojas locales o flujos legacy.', status: 'premium', href: '/vault/pro', accent: 'green' },
  { id: 'google-sheets-command-kit', name: 'Google Sheets Command Room', group: 'Full-only surface', unlocks: 'Command room para Sheets con acciones, sidebar y framing premium.', audience: 'Equipos que quieren vender mejora de hojas en la nube.', status: 'full-only', href: '/vault/launch', accent: 'mint' },
  { id: 'microsoft-365-excel-web-kit', name: 'Microsoft 365 Excel Web Kit', group: 'Full-only surface', unlocks: 'Superficie Excel Web para entregas enterprise.', audience: 'Clientes Microsoft 365 y equipos corporativos.', status: 'full-only', href: '/vault/launch', accent: 'sky' },
  { id: 'outlook-approval-console', name: 'Outlook Approval Console', group: 'Full-only surface', unlocks: 'Patrones de aprobacion por correo y handoff ejecutivo.', audience: 'Equipos con flujos de decision por email.', status: 'full-only', href: '/vault/launch', accent: 'peach' },
  { id: 'executive-boardroom-surface', name: 'Executive Boardroom Surface', group: 'Full-only surface', unlocks: 'Capa de presentacion para cierre, demos ejecutivas y confianza.', audience: 'Founders, agencias y ventas enterprise.', status: 'full-only', href: '/vault/launch', accent: 'lavender' },
  { id: 'power-bi-executive-visual-pack', name: 'Power BI Executive Visual Pack', group: 'Full-only surface', unlocks: 'Tema y framing para analitica ejecutiva.', audience: 'Equipos que venden dashboards y reportes.', status: 'full-only', href: '/vault/launch', accent: 'gold' },
  { id: 'figma-token-sync-plugin', name: 'Figma Token Sync Plugin', group: 'Full-only surface', unlocks: 'Handoff de tokens para conectar diseno y entrega.', audience: 'Disenadores, PMs y equipos con design system.', status: 'full-only', href: '/vault/launch', accent: 'rose' },
];

export const inventoryStats = [
  {
    id: 'app-routes',
    value: appRoutes.length,
    label: 'Rutas app',
    description: 'Pantallas y paginas para productos reales.',
    accent: 'sky' as const,
  },
  {
    id: 'demo-routes',
    value: demoRoutes.length,
    label: 'Rutas demo',
    description: 'Ejemplos navegables para probar valor.',
    accent: 'rose' as const,
  },
  {
    id: 'components',
    value: componentCatalog.length,
    label: 'Componentes React',
    description: 'Bloques UI listos para produccion.',
    accent: 'mint' as const,
  },
  {
    id: 'runtimes',
    value: runtimeProfiles.length,
    label: 'Perfiles runtime',
    description: 'Compatibilidad por entorno y madurez.',
    accent: 'lavender' as const,
  },
  {
    id: 'cli-starters',
    value: cliStarters.length,
    label: 'Starters CLI',
    description: 'Arranques rapidos por caso de uso.',
    accent: 'gold' as const,
  },
  {
    id: 'premium-assets',
    value: premiumAssets.length,
    label: 'Assets premium',
    description: 'Previews, shells, layouts y Full-only.',
    accent: 'peach' as const,
  },
];

export const categoryLabels: Record<InventoryCategory | 'all', string> = {
  all: 'Todo',
  'app-route': 'Rutas app',
  demo: 'Demos',
  component: 'Componentes',
  runtime: 'Runtimes',
  'cli-starter': 'Starters CLI',
  'premium-asset': 'Premium',
};

export const categoryOrder: Array<InventoryCategory | 'all'> = [
  'all',
  'app-route',
  'demo',
  'component',
  'runtime',
  'cli-starter',
  'premium-asset',
];

export const inventoryItems: InventoryItem[] = [
  ...appRoutes.map((route): InventoryItem => ({
    id: `route-${route.path}`,
    name: route.name,
    category: 'app-route',
    status: route.status,
    description: route.description,
    simpleValue: route.simpleValue,
    href: route.href,
    tags: [route.group, route.path],
    accent: route.accent,
  })),
  ...demoRoutes.map((demo): InventoryItem => ({
    id: `demo-${demo.path}`,
    name: demo.name,
    category: 'demo',
    status: 'live',
    description: demo.description,
    simpleValue: demo.useCase,
    href: demo.href,
    tags: ['Live demo', demo.path],
    accent: demo.accent,
  })),
  ...componentCatalog.map((component): InventoryItem => ({
    id: `component-${component.id}`,
    name: component.name,
    category: 'component',
    status: component.tier === 'free' ? 'ready' : 'premium',
    description: component.what,
    simpleValue: component.why,
    href: component.href,
    tags: [component.category, component.tier],
    accent: component.accent,
  })),
  ...runtimeProfiles.map((runtime): InventoryItem => ({
    id: `runtime-${runtime.id}`,
    name: runtime.name,
    category: 'runtime',
    status: runtime.maturity === 'stable' ? 'stable' : runtime.maturity === 'experimental' ? 'preview' : runtime.maturity,
    description: `${runtime.environment}. ${runtime.support}.`,
    simpleValue: runtime.idealFor,
    href: runtime.href,
    tags: [runtime.maturity, runtime.environment],
    accent: runtime.accent,
  })),
  ...cliStarters.map((starter): InventoryItem => ({
    id: `starter-${starter.id}`,
    name: starter.name,
    category: 'cli-starter',
    status: starter.status,
    description: starter.useCase,
    simpleValue: `Arranca en ${starter.startTime}.`,
    tags: [starter.family, starter.stack],
    accent: starter.accent,
  })),
  ...premiumAssets.map((asset): InventoryItem => ({
    id: `premium-${asset.id}`,
    name: asset.name,
    category: 'premium-asset',
    status: asset.status,
    description: asset.unlocks,
    simpleValue: asset.audience,
    href: asset.href,
    tags: [asset.group, asset.status],
    accent: asset.accent,
  })),
];

export const useCases = [
  {
    title: 'Founder que necesita mostrar producto',
    story: 'Quiero abrir una demo, ensenar el valor y tener una ruta clara a precio.',
    outcome: 'Usa Home, Demo wall, Pricing, Vault demo y Executive Briefing Layout.',
    accent: 'peach' as const,
  },
  {
    title: 'Agencia que vende dashboards',
    story: 'Quiero partir de un shell creible y adaptarlo a cada cliente.',
    outcome: 'Usa Dashboard Shell, Operator Triad, Finance Ops Kit y starters CLI.',
    accent: 'mint' as const,
  },
  {
    title: 'Dev que no quiere empezar de cero',
    story: 'Quiero copiar una base, ver componentes y conectar mi stack.',
    outcome: 'Usa Playground, Component gallery, Runtime Matrix y CLI starters.',
    accent: 'sky' as const,
  },
  {
    title: 'PM o designer que necesita evaluar',
    story: 'Quiero entender que existe, que esta vivo y que se desbloquea.',
    outcome: 'Usa Collection Explorer, Premium inventory y demos antes/despues.',
    accent: 'lavender' as const,
  },
];

export const stateMachines = [
  {
    name: 'Compra y acceso',
    states: ['Visitante', 'Interesado', 'Checkout', 'Comprador', 'Vault activo'],
    description: 'La home educa, precios convierten, checkout valida y vault entrega.',
    accent: 'rose' as const,
  },
  {
    name: 'Entrega de interfaz',
    states: ['Base', 'Demo', 'Starter', 'Personalizacion', 'Handoff'],
    description: 'El equipo empieza con una ruta real, prueba un patron y lo adapta.',
    accent: 'gold' as const,
  },
  {
    name: 'Capa AI segura',
    states: ['Contexto', 'Contrato', 'Composicion', 'Revision', 'Release'],
    description: 'Los agentes reciben inventario y contratos antes de componer UI.',
    accent: 'aqua' as const,
  },
];

function assertCount(label: string, actual: number, expected: number) {
  if (actual !== expected) {
    throw new Error(`LotOS home inventory mismatch for ${label}: expected ${expected}, got ${actual}`);
  }
}

assertCount('app routes', appRoutes.length, 37);
assertCount('demo routes', demoRoutes.length, 13);
assertCount('components', componentCatalog.length, 27);
assertCount('runtime profiles', runtimeProfiles.length, 19);
assertCount('CLI starters', cliStarters.length, 18);
assertCount('premium assets', premiumAssets.length, 17);
