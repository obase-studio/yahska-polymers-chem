const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://jlbwwbnatmmkcizqprdx.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsYnd3Ym5hdG1ta2NpenFwcmR4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjQ4Nzg4MiwiZXhwIjoyMDcyMDYzODgyfQ.VRsTCJYa_lrRmhaNTInT9FnozS4B-imm0NCPr20ynkw';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

console.log('🔄 Uploading exact products from catalog...');

// Define the exact categories from the original catalog
const categories = [
  { id: 'admixtures', name: 'Admixtures', description: 'High-performance concrete admixtures for enhanced workability', sort_order: 1 },
  { id: 'accelerators', name: 'Accelerators', description: 'Setting time accelerators for fast construction', sort_order: 2 },
  { id: 'misc-admixtures', name: 'Misc Admixtures', description: 'Specialized admixtures for specific applications', sort_order: 3 },
  { id: 'integral-waterproofing', name: 'Integral Waterproofing', description: 'Built-in waterproofing solutions', sort_order: 4 },
  { id: 'curing-compound', name: 'Curing Compound', description: 'Concrete curing and protection compounds', sort_order: 5 },
  { id: 'grouts', name: 'Grouts', description: 'High-strength precision grouting materials', sort_order: 6 },
  { id: 'floor-hardeners', name: 'Floor Hardeners', description: 'Surface hardening solutions for concrete floors', sort_order: 7 },
  { id: 'micro-silica', name: 'Micro Silica', description: 'Silica fume for high-performance concrete', sort_order: 8 },
  { id: 'structural-bonding', name: 'Structural Bonding', description: 'Structural adhesives and bonding agents', sort_order: 9 },
  { id: 'corrosion-inhibitor', name: 'Corrosion Inhibitor', description: 'Anti-corrosion protection for reinforcement', sort_order: 10 },
  { id: 'mould-release-agent', name: 'Mould Release Agent', description: 'Form release agents for concrete casting', sort_order: 11 },
  { id: 'other', name: 'Other', description: 'Specialized construction chemical products', sort_order: 12 }
];

// Define the exact products from the original catalog
const products = [
  {
    name: 'Super P UT',
    description: 'High range superplasticiser for workability and integral waterproofing',
    category_id: 'admixtures',
    applications: ['Concrete where 5 to 20% water reduction is desired', 'Concrete where normal setting times are required'],
    features: ['Provides better slump retention', 'Provides excellent workability']
  },
  {
    name: 'YPC IB20',
    description: 'PCE based superplasticiser for workability and integral waterproofing of concrete for site specific plants',
    category_id: 'admixtures',
    applications: ['Suitable for site specific project plant', 'Concretes which must be easy to lay'],
    features: ['Improved workability allowing easier, quicker placing and compaction', 'Higher cohesion minimizing risk of segregation & bleeding']
  },
  {
    name: 'YPC X22',
    description: 'PCE based superplasticiser for workability and integral waterproofing of concrete',
    category_id: 'admixtures',
    applications: ['Concrete requiring long workability retention', 'High performance concrete for durability'],
    features: ['Improved workability allowing easier, quicker placing and compaction', 'Higher cohesion minimizing risk of segregation & bleeding']
  },
  {
    name: 'YPC 40X',
    description: 'PCE based superplasticiser for High Grade Precast Concrete',
    category_id: 'admixtures',
    applications: ['Production of precast concrete with high early strength', 'Pre-stressed & post-stressed concretes'],
    features: ['Increased early and ultimate compressive strengths', 'No bleeding in concrete']
  },
  {
    name: 'YPC RB70',
    description: 'PCE based admixture for wide range of Pavement Quality Concrete (PQC) grades',
    category_id: 'admixtures',
    applications: ['Suitable for PQC concrete', 'To produce strong and lifetime pavement'],
    features: ['Improved workability allowing easier, quicker placing and compaction', 'Improved quality with denser concrete with reduced porosity and hence more durable']
  },
  {
    name: 'YPC 120X',
    description: 'PCE based superplasticiser for High Grade and Self Compacting Concrete',
    category_id: 'admixtures',
    applications: ['Production of self compacting concrete', 'Production of high grade concrete'],
    features: ['Increased early and ultimate compressive strengths', 'No bleeding in concrete']
  },
  {
    name: 'YP Shotset 30',
    description: 'Alkali Free liquid accelerator for sprayed concrete for shotcreting',
    category_id: 'accelerators',
    applications: ['Tunnel linings and underground excavations', 'Rock and slope stabilization'],
    features: ['Fast setting with high early strength gain', 'Low rebound loss for material efficiency']
  },
  {
    name: 'YP Retarder',
    description: 'Retarding plasticiser for concrete. Facilitates extended workability for mass concrete placements, reducing cold joint formation',
    category_id: 'misc-admixtures',
    applications: ['Delays setting time in elevated temperatures', 'allowing adequate placement and finishing'],
    features: ['Provides predictable extension of setting time, enhancing scheduling flexibility', 'Enhances concrete flow without increasing water content, leading to better placement']
  },
  {
    name: 'YP Accelerator',
    description: 'Accelerating admixture to reduce setting time of concrete',
    category_id: 'misc-admixtures',
    applications: ['Precast and prestressed concrete requiring high early strength', 'Cold weather concreting to accelerate strength gain'],
    features: ['Allows for early stripping and re-use of forms', 'Facilitates faster finishing operations on flatwork surfaces']
  },
  {
    name: 'YP Antiwashout',
    description: 'Underwater Concrete Stabilizer',
    category_id: 'misc-admixtures',
    applications: ['Underwater foundations for bridges and marine structures', 'Construction of breakwaters and coastal installations'],
    features: ['Prevents segregation and washout, ensuring concrete integrity underwater', 'Eliminates the need for vibration due to extended workability']
  },
  {
    name: 'YP Crystal IP',
    description: 'Crystalline waterproofing admixture for mortar and concrete',
    category_id: 'integral-waterproofing',
    applications: ['Waterproofing concrete basements, tanks, and substructures', 'Suitable for water-retaining and water-excluding structures'],
    features: ['Self-heals micro-cracks through crystal growth', 'Provides long-term integral waterproofing durability']
  },
  {
    name: 'YP LW+',
    description: 'Integral waterproofing and plasticizing admixture for concrete and mortar',
    category_id: 'integral-waterproofing',
    applications: ['Waterproofing roof slabs, screeds, basements, and water-retaining structures', 'Enhancing durability of external plastering, bathrooms, and repair works'],
    features: ['Improves watertightness and reduces permeability in concrete and mortar', 'Enhances workability and minimizes shrinkage cracks without increasing water content']
  },
  {
    name: 'SuperCure X150',
    description: 'Aluminised synthetic resin-based for PQC',
    category_id: 'curing-compound',
    applications: ['Curing compound for PQC roads and runways', 'Ideal for large exposed concrete surfaces'],
    features: ['Reduces water loss, preventing shrinkage cracks', 'Improves surface strength and durability']
  },
  {
    name: 'SuperCure CC375',
    description: 'Heat reflective, white pigmented, water-based wax emulsion-based curing compound',
    category_id: 'curing-compound',
    applications: ['Curing large exposed concrete areas like highways and runways', 'Suitable for canal linings and other expansive surfaces'],
    features: ['Reduces plastic cracking and surface dusting', 'Ensures designed strength attainment and minimizes shrinkage']
  },
  {
    name: 'SuperCure D120',
    description: 'Resin-based, white pigmented curing compound with superb water retention efficiency',
    category_id: 'curing-compound',
    applications: ['Curing freshly laid concrete surfaces', 'Sealing and dustproofing floors and walls'],
    features: ['Minimizes shrinkage cracks by retaining moisture', 'Compatible with various over-coatings']
  },
  {
    name: 'YP Grout NS2',
    description: 'Free flow, high strength, non-shrink, cementitious precision grout',
    category_id: 'grouts',
    applications: ['Grouting under base plates of heavy machinery', 'Anchoring bolts, rods, and steel inserts', 'Filling voids in structural concrete repairs'],
    features: ['Non-shrink—ensures full contact and load transfer', 'High early and final compressive strength', 'Free-flowing—fills complex gaps with ease']
  },
  {
    name: 'YP Grout NS85',
    description: 'High-flow, dual shrinkage-compensated cementitious grout with rapid strength gain and high ultimate strength',
    category_id: 'grouts',
    applications: ['Grouting baseplates and soleplates of large machinery subject to moderate dynamic loads', 'Grouting precast wall panels, beams, columns, and structural building members'],
    features: ['Non-metallic dual expansion system compensates for shrinkage in both plastic and hardened states', 'Excellent initial flow and flow retention suitable for large and small grout pours']
  },
  {
    name: 'YP SmoothCoat',
    description: 'Single-component, polymer-modified, cementitious fairing coat',
    category_id: 'grouts',
    applications: ['Filling surface defects like blowholes and pinholes', 'Finishing repaired areas for uniform appearance'],
    features: ['Excellent adhesion to concrete', 'Smooth, paint-ready finish']
  },
  {
    name: 'YP Grout EPLV',
    description: 'High Strength, Low Viscosity Epoxy Grout',
    category_id: 'grouts',
    applications: ['Underplate grouting to substantial structural elements', 'Structural infill where very high strength is required'],
    features: ['High compressive, tensile, and flexural strengths', 'Resistant to repetitive dynamic loads']
  },
  {
    name: 'YP Grout MC',
    description: 'General purpose, non-shrink, cementitious microconcrete',
    category_id: 'grouts',
    applications: ['Structural concrete repairs in congested areas', 'Jacketing and encasement of columns/beams'],
    features: ['Non-shrink with high strength gain', 'Flowable—no vibration needed']
  },
  {
    name: 'YP EGA 100',
    description: 'Plasticised expanding grout admixture',
    category_id: 'grouts',
    applications: ['Bed and duct grouting for machinery and precast units', 'Non-shrink infilling and precision jointing applications'],
    features: ['Gaseous expansion compensates for plastic shrinkage and settlement', 'Provides the grout with high fluidity at a low water-to-cement ratio, making placement or injection effortless']
  },
  {
    name: 'YP Floor HD M',
    description: 'Metallic Monolithic Surface Hardener for Concrete Floors',
    category_id: 'floor-hardeners',
    applications: ['Heavy-duty floors in foundries and steel plants', 'High-impact zones like loading docks and truck lanes'],
    features: ['Superior abrasion and impact resistance', 'Metallic finish withstands extreme wear conditions']
  },
  {
    name: 'YP Floor HD NM',
    description: 'Non-Metallic Monolithic Surface Hardener for Concrete Floors',
    category_id: 'floor-hardeners',
    applications: ['Heavy-duty industrial floors like workshops and machine shops', 'High-traffic zones such as loading bays and trucking lanes'],
    features: ['Provides a hard, abrasion resistant surface', 'Forms monolithic bond with base concrete']
  },
  {
    name: 'YP Micro Silica',
    description: 'Densified Silica Fume',
    category_id: 'micro-silica',
    applications: ['High-strength concrete', 'Waterproof structures like tunnels and basements'],
    features: ['Increases strength and durability of concrete', 'Reduces permeability and improves chemical resistance']
  },
  {
    name: 'YP Bond EP',
    description: 'Epoxy resin concrete bonding agent',
    category_id: 'structural-bonding',
    applications: ['Bonds old concrete to new concrete', 'Used in structural concrete repairs'],
    features: ['Allows longer concrete placement without risk of delamination', 'Provides bond strength higher than concrete tensile strength']
  },
  {
    name: 'Yahska SBA25',
    description: 'Segmental bridge adhesive for use at +25°C to +45°C',
    category_id: 'structural-bonding',
    applications: ['Segmental bridge construction'],
    features: ['Provides a watertight joint between segments', 'Transfers the loading stresses between segments']
  },
  {
    name: 'YP SBR 100',
    description: 'Water resistant, styrene butadiene rubber based bonding agent and mortar additive',
    category_id: 'structural-bonding',
    applications: ['Bonding agent for concrete and plaster repair', 'Modifier for waterproof screeds and mortars'],
    features: ['Improves bond strength and flexibility', 'Enhances water resistance and durability']
  },
  {
    name: 'AntiCorr FG',
    description: 'Bipolar corrosion inhibiting concrete admixture',
    category_id: 'corrosion-inhibitor',
    applications: ['Extends life of reinforced concrete in corrosive environments', 'Used in repair and protection of RCC structures'],
    features: ['Protects both anodic and cathodic zones of rebar', 'Reduces corrosion without increasing concrete resistivity']
  },
  {
    name: 'AntiCorr CN',
    description: 'Corrosion Inhibiting Admixture based on Nitrite',
    category_id: 'corrosion-inhibitor',
    applications: ['Added to new concrete for corrosion protection of steel', 'Ideal for marine, coastal, and chloride-exposed structures'],
    features: ['Forms protective layer on steel reinforcement', 'Minimizes corrosion from chlorides and aggressive agents']
  },
  {
    name: 'MR50w',
    description: 'New generation water emulsion mould release agent',
    category_id: 'mould-release-agent',
    applications: ['Provides easy, stain-free release for concrete molds', 'Suitable for all types of molds and formwork'],
    features: ['Non-staining formula eliminates unsightly oil marks', 'Concentrated, water-based solution reduces cost']
  },
  {
    name: 'MR100',
    description: 'High performance environmental friendly mould release agent',
    category_id: 'mould-release-agent',
    applications: ['Facilitates clean stripping of various formwork types', 'Ensures high-quality, fair-faced concrete finishes'],
    features: ['Minimizes surface blemishes and staining on concrete', 'Reduces cleaning time between formwork reuses']
  },
  {
    name: 'YP CP Lube',
    description: 'Pump Priming Aid',
    category_id: 'other',
    applications: ['Pumping of Standard concrete & shotcretes'],
    features: ['Economical compared to use of cement slurry', 'No adverse effect on concrete set time']
  },
  {
    name: 'YP Polysulphide PG',
    description: 'Two component pour grade Polysulphide sealant',
    category_id: 'other',
    applications: ['Precast concrete elements', 'Rigid pavements of highways, airport runways, etc'],
    features: ['Excellent adhesion with most common construction materials', 'High movement accommodation']
  },
  {
    name: 'YP DF 100',
    description: 'Soil Stabilization Powder Polymer',
    category_id: 'other',
    applications: ['Horizontal Directional Drilling (HDD), Piling, D-Wall, etc'],
    features: ['Strengthens the bore by increasing cohesiveness in loose particles', 'Controls the fluid loss, thus reducing the overall cost']
  },
  {
    name: 'YP TileMaster V',
    description: 'Cementitious, polymer based general purpose tile fixing adhesive',
    category_id: 'other',
    applications: ['Fixing ceramic and vitrified tiles on floors and walls', 'Tiling on internal surfaces like kitchens and bathrooms'],
    features: ['Strong bond with vertical and horizontal surfaces', 'Easy mixing and application with good open time']
  }
];

async function uploadExactData() {
  try {
    console.log('📦 Uploading exact categories...');
    for (const category of categories) {
      const { error } = await supabase
        .from('product_categories')
        .insert(category);
      
      if (error) {
        console.error(`❌ Error inserting category ${category.name}:`, error.message);
      } else {
        console.log(`✅ Uploaded category: ${category.name}`);
      }
    }

    console.log('\n🛍️ Uploading exact products...');
    for (const product of products) {
      const { error } = await supabase
        .from('products')
        .insert({
          ...product,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`❌ Error inserting product ${product.name}:`, error.message);
      } else {
        console.log(`✅ Uploaded product: ${product.name}`);
      }
    }

    // Verify upload
    const { count: categoryCount } = await supabase
      .from('product_categories')
      .select('*', { count: 'exact', head: true });
    
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    console.log(`\n🎉 Upload completed successfully!`);
    console.log(`✅ Categories: ${categoryCount}`);
    console.log(`✅ Products: ${productCount}`);
    console.log(`\n🌐 Your website now shows the exact products from your Excel catalog!`);

  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
}

uploadExactData();