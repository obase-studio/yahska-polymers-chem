import Link from "next/link"
import { ArrowLeft, Download, Mail, Phone, CheckCircle, Beaker, Factory, Truck } from "lucide-react"

const products = {
  "superplasticizer-snf": {
    name: "Superplasticizer Concrete Admixture (SNF Based)",
    category: "Concrete Admixtures",
    industry: "Construction",
    price: "₹40/Kg",
    description:
      "High-performance superplasticizer based on Sulfonated Naphthalene Formaldehyde for enhanced concrete workability and strength.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Reduces water content by 15-25%",
      "Improves concrete workability",
      "Increases compressive strength",
      "Compatible with all types of cement",
      "Chloride-free formulation",
    ],
    applications: [
      "Ready Mix Concrete Plants",
      "Precast Concrete Manufacturing",
      "High-Rise Construction Projects",
      "Infrastructure Development",
      "Bridge and Tunnel Construction",
    ],
    technicalSpecs: {
      Appearance: "Brown powder",
      "Bulk Density": "500-600 kg/m³",
      "pH Value": "7-9",
      "Chloride Content": "< 0.1%",
      Dosage: "0.5-2.0% by weight of cement",
    },
    packaging: ["25 kg bags", "50 kg bags", "500 kg jumbo bags", "Bulk supply available"],
    industries: ["Construction", "Infrastructure", "Precast Concrete"],
  },
  "sodium-ligno-sulphonate": {
    name: "Sodium Ligno Sulphonate",
    category: "Dispersing Agents",
    industry: "Construction",
    price: "₹60/Kg",
    description:
      "Natural polymer-based dispersing agent derived from wood pulp, ideal for concrete and industrial applications.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Natural polymer base",
      "Excellent dispersing properties",
      "Reduces water requirement",
      "Improves concrete workability",
      "Environmentally friendly",
    ],
    applications: [
      "Concrete Plasticizer",
      "Ceramic Binder Applications",
      "Dust Control Agent",
      "Textile Dyeing Assistant",
      "Leather Tanning Process",
    ],
    technicalSpecs: {
      Appearance: "Brown powder",
      "Moisture Content": "< 5%",
      "pH Value": "8-10",
      "Reducing Sugar": "< 4%",
      Dosage: "0.2-0.8% by weight of cement",
    },
    packaging: ["25 kg bags", "50 kg bags", "Bulk supply available"],
    industries: ["Construction", "Textile", "Ceramics", "Leather"],
  },
  "concrete-admixture": {
    name: "Concrete Admixture",
    category: "Concrete Admixtures",
    industry: "Construction",
    price: "₹32/Kg",
    description: "General purpose concrete admixture designed to improve workability and durability of concrete mixes.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Improves workability",
      "Reduces segregation",
      "Enhances durability",
      "Cost-effective solution",
      "Easy to use",
    ],
    applications: [
      "General Construction",
      "Residential Buildings",
      "Commercial Projects",
      "Infrastructure Development",
      "Road Construction",
    ],
    technicalSpecs: {
      Appearance: "Dark brown liquid",
      "Specific Gravity": "1.15-1.25",
      "pH Value": "6-8",
      "Chloride Content": "Nil",
      Dosage: "0.5-1.5% by weight of cement",
    },
    packaging: ["200 L drums", "1000 L IBC tanks", "Bulk tankers"],
    industries: ["Construction", "Infrastructure"],
  },
  "lignosulphonate-powder": {
    name: "Lignosulphonate Powder",
    category: "Dispersing Agents",
    industry: "Construction",
    price: "₹90/Kg",
    description: "Premium grade lignosulphonate powder for specialized high-performance applications.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Premium quality grade",
      "Superior dispersing action",
      "High purity formulation",
      "Consistent performance",
      "Long shelf life",
    ],
    applications: [
      "High-Performance Concrete",
      "Specialty Mortars",
      "Industrial Applications",
      "Refractory Materials",
      "Oil Well Drilling",
    ],
    technicalSpecs: {
      Appearance: "Light brown powder",
      Purity: "> 95%",
      "Moisture Content": "< 3%",
      "pH Value": "8-10",
      Dosage: "0.3-1.0% by weight of cement",
    },
    packaging: ["25 kg bags", "500 kg jumbo bags", "Customized packaging"],
    industries: ["Construction", "Oil & Gas", "Refractory"],
  },
  "hyper-plasticizer-pc": {
    name: "Hyper Plasticizer (PC Base Admixture)",
    category: "Concrete Admixtures",
    industry: "Construction",
    price: "₹60/Kg",
    description: "Advanced polycarboxylate-based hyper plasticizer for superior concrete performance and strength.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "High water reduction (30-40%)",
      "Superior workability retention",
      "Enhanced early strength",
      "Reduced shrinkage",
      "Improved durability",
    ],
    applications: [
      "High-Strength Concrete",
      "Self-Compacting Concrete",
      "Precast Elements",
      "Architectural Concrete",
      "Marine Structures",
    ],
    technicalSpecs: {
      Appearance: "Light yellow liquid",
      "Solid Content": "40±2%",
      "pH Value": "6-8",
      "Chloride Content": "< 0.1%",
      Dosage: "0.8-2.5% by weight of cement",
    },
    packaging: ["200 L drums", "1000 L IBC tanks", "Bulk supply"],
    industries: ["Construction", "Precast", "Infrastructure"],
  },
  "polycarboxylate-ether": {
    name: "Polycarboxylate Ether (PC Liquid) PC SR",
    category: "Construction Chemicals",
    industry: "Construction",
    price: "₹90/Kg",
    description:
      "State-of-the-art polycarboxylate ether-based superplasticizer for ultra-high performance concrete applications.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Ultra-high water reduction",
      "Excellent slump retention",
      "Superior strength development",
      "Low shrinkage properties",
      "Enhanced workability",
    ],
    applications: [
      "Ultra-High Performance Concrete",
      "Bridge Construction",
      "Tunnel Projects",
      "High-Rise Buildings",
      "Prestressed Concrete",
    ],
    technicalSpecs: {
      Appearance: "Colorless to light yellow liquid",
      "Solid Content": "50±2%",
      "pH Value": "5-7",
      Density: "1.08±0.02 g/cm³",
      Dosage: "1.0-3.0% by weight of cement",
    },
    packaging: ["200 L drums", "1000 L IBC tanks", "Bulk tankers"],
    industries: ["Construction", "Infrastructure", "Precast"],
  },
  "sodium-naphthalene-formaldehyde": {
    name: "Sodium Naphthalene Formaldehyde",
    category: "Dispersing Agents",
    industry: "Textile Industry",
    price: "₹100/Kg",
    description: "High-quality dispersing agent specifically designed for textile and dyestuff applications.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Excellent dispersing properties",
      "High thermal stability",
      "Superior color fastness",
      "Uniform dye distribution",
      "Reduced foaming",
    ],
    applications: [
      "Textile Dyeing Process",
      "Pigment Dispersion",
      "Leather Processing",
      "Paper Industry",
      "Ceramic Applications",
    ],
    technicalSpecs: {
      Appearance: "Light brown powder",
      Purity: "> 92%",
      "pH Value": "7-9",
      "Moisture Content": "< 5%",
      Dosage: "0.5-2.0% of dye weight",
    },
    packaging: ["25 kg bags", "50 kg bags", "Customized packaging"],
    industries: ["Textile", "Leather", "Paper", "Ceramics"],
  },
  "concrete-curing-compound": {
    name: "Concrete Curing Compound",
    category: "Construction Chemicals",
    industry: "Construction",
    price: "₹40/Kg",
    description: "Membrane-forming curing compound that ensures optimal concrete hydration and strength development.",
    image: "/placeholder.svg?height=400&width=600",
    features: [
      "Forms protective membrane",
      "Prevents moisture loss",
      "Enhances strength development",
      "UV resistant formulation",
      "Easy application",
    ],
    applications: ["Road Construction", "Airport Runways", "Industrial Flooring", "Parking Structures", "Bridge Decks"],
    technicalSpecs: {
      Appearance: "White liquid",
      "Solid Content": "25±2%",
      "Specific Gravity": "0.95-1.05",
      "Drying Time": "30-60 minutes",
      Coverage: "4-6 m²/L",
    },
    packaging: ["20 L cans", "200 L drums", "Bulk supply"],
    industries: ["Construction", "Infrastructure", "Industrial"],
  },
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products[params.id as keyof typeof products]

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-blue-600">
              Products
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-96 object-cover" />
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {product.category}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {product.industry}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-6">{product.description}</p>

            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-3xl font-bold text-blue-600">{product.price}</span>
                <span className="text-gray-500 ml-2">Ex-works price</span>
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Mail className="w-5 h-5 inline mr-2" />
                Request Quote
              </button>
              <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
                <Phone className="w-5 h-5 inline mr-2" />
                Call Now
              </button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button className="py-4 px-1 border-b-2 border-blue-600 text-blue-600 font-medium">Applications</button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700">Technical Specifications</button>
              <button className="py-4 px-1 text-gray-500 hover:text-gray-700">Packaging</button>
            </nav>
          </div>

          <div className="p-8">
            {/* Applications Tab */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Factory className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
                </div>
                <ul className="space-y-2">
                  {product.applications.map((app, index) => (
                    <li key={index} className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      {app}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Beaker className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Technical Specs</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(product.technicalSpecs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <Truck className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Packaging Options</h3>
                </div>
                <ul className="space-y-2">
                  {product.packaging.map((pack, index) => (
                    <li key={index} className="text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                      {pack}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 rounded-lg p-8 mt-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need Technical Support or Custom Solutions?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our technical experts are ready to help you find the perfect solution for your specific requirements. Get
            personalized recommendations and technical data sheets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <Download className="w-5 h-5 inline mr-2" />
              Download Technical Data Sheet
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Contact Technical Team
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
