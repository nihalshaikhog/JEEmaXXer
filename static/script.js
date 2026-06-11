let userName = '';
let examTarget = '';
let daysLeft = '';
let conversationHistory = [];
let currentTab = 'physics';
let warningCount = 0;
let isBanned = false;
let banEndTime = null;
let completedTopics = {};
const BACKEND_URL = '';

const badWords = [
  'chutiya', 'madarchod', 'bhenchod', 'bsdk', 'loda', 'lavda',
  'randi', 'harami', 'fuck', 'bitch', 'bastard', 'mkc', 'mc', 'bc',
  'lund', 'chut', 'lauda', 'gand', 'mutthi', 'gaand', 'bhosdike',
  'chuse', 'chusega', 'chatunga', 'maderchod', 'bhosdi', 'saala',
  'kamina', 'kutte', 'haramzade'
];

const syllabus = {
  physics: [
    {
      chapter: "Units and Dimensions",
      topics: [
        { name: "Physical Quantities and Units", formula: "SI Units: m, kg, s, A, K, mol, cd" },
        { name: "Dimensional Analysis", formula: "[M^a L^b T^c]" },
        { name: "Significant Figures", formula: "Rules of significant figures" },
        { name: "Error Analysis", formula: "Δz/z = Δa/a + Δb/b" },
        { name: "Dimensional Formulae", formula: "e.g. Force = [MLT⁻²]" }
      ]
    },
    {
      chapter: "Kinematics",
      topics: [
        { name: "Distance and Displacement", formula: "Displacement = final - initial position" },
        { name: "Speed and Velocity", formula: "v = Δx/Δt" },
        { name: "Acceleration", formula: "a = Δv/Δt" },
        { name: "Equations of Motion", formula: "v = u+at, s = ut+½at², v² = u²+2as" },
        { name: "Projectile Motion", formula: "R = u²sin2θ/g, H = u²sin²θ/2g" },
        { name: "Relative Motion", formula: "v_AB = v_A - v_B" }
      ]
    },
    {
      chapter: "Laws of Motion",
      topics: [
        { name: "Newton's First Law", formula: "Inertia — object stays at rest or motion" },
        { name: "Newton's Second Law", formula: "F = ma" },
        { name: "Newton's Third Law", formula: "F_AB = -F_BA" },
        { name: "Friction", formula: "f = μN" },
        { name: "Circular Motion", formula: "F_c = mv²/r" }
      ]
    },
    {
      chapter: "Work, Energy and Power",
      topics: [
        { name: "Work Done", formula: "W = F·d·cosθ" },
        { name: "Kinetic Energy", formula: "KE = ½mv²" },
        { name: "Potential Energy", formula: "PE = mgh" },
        { name: "Work-Energy Theorem", formula: "W_net = ΔKE" },
        { name: "Power", formula: "P = W/t = Fv" }
      ]
    },
    {
      chapter: "Gravitation",
      topics: [
        { name: "Newton's Law of Gravitation", formula: "F = Gm₁m₂/r²" },
        { name: "Gravitational Field", formula: "g = GM/r²" },
        { name: "Escape Velocity", formula: "v_e = √(2GM/R)" },
        { name: "Orbital Velocity", formula: "v_o = √(GM/r)" },
        { name: "Kepler's Laws", formula: "T² ∝ r³" }
      ]
    },
    {
      chapter: "Electrostatics",
      topics: [
        { name: "Coulomb's Law", formula: "F = kq₁q₂/r²" },
        { name: "Electric Field", formula: "E = F/q = kQ/r²" },
        { name: "Electric Potential", formula: "V = kQ/r" },
        { name: "Potential Difference", formula: "W = q(V_A - V_B)" },
        { name: "Capacitance", formula: "C = Q/V" },
        { name: "Gauss's Law", formula: "∮E·dA = q/ε₀" }
      ]
    },
    {
      chapter: "Current Electricity",
      topics: [
        { name: "Ohm's Law", formula: "V = IR" },
        { name: "Resistivity", formula: "R = ρL/A" },
        { name: "Kirchhoff's Laws", formula: "ΣI = 0, ΣV = 0" },
        { name: "Wheatstone Bridge", formula: "P/Q = R/S" },
        { name: "Power", formula: "P = VI = I²R = V²/R" }
      ]
    },
    {
      chapter: "Electromagnetic Induction",
      topics: [
        { name: "Faraday's Law", formula: "ε = -dΦ/dt" },
        { name: "Lenz's Law", formula: "Induced current opposes change" },
        { name: "Self Inductance", formula: "ε = -L(dI/dt)" },
        { name: "Mutual Inductance", formula: "ε = -M(dI/dt)" },
        { name: "AC Generator", formula: "ε = NBAω sin(ωt)" }
      ]
    },
    {
      chapter: "Modern Physics",
      topics: [
        { name: "Photoelectric Effect", formula: "KE = hf - φ" },
        { name: "de Broglie Wavelength", formula: "λ = h/mv" },
        { name: "Bohr's Model", formula: "E_n = -13.6/n² eV" },
        { name: "Radioactivity", formula: "N = N₀e^(-λt)" },
        { name: "Mass-Energy Equivalence", formula: "E = mc²" }
      ]
    }
  ],
  chemistry: [
    {
      chapter: "Some Basic Concepts",
      topics: [
        { name: "Mole Concept", formula: "1 mole = 6.022×10²³ particles" },
        { name: "Molar Mass", formula: "n = mass/molar mass" },
        { name: "Molarity", formula: "M = moles/volume(L)" },
        { name: "Stoichiometry", formula: "Mole ratios from balanced equation" }
      ]
    },
    {
      chapter: "Atomic Structure",
      topics: [
        { name: "Bohr's Model", formula: "E_n = -13.6/n² eV" },
        { name: "Quantum Numbers", formula: "n, l, m_l, m_s" },
        { name: "Electronic Configuration", formula: "Aufbau, Hund's, Pauli" },
        { name: "de Broglie", formula: "λ = h/mv" }
      ]
    },
    {
      chapter: "Chemical Bonding",
      topics: [
        { name: "Ionic Bond", formula: "Electron transfer between atoms" },
        { name: "Covalent Bond", formula: "Electron sharing" },
        { name: "VSEPR Theory", formula: "Shape based on electron pairs" },
        { name: "Hybridization", formula: "sp, sp², sp³, sp³d" }
      ]
    },
    {
      chapter: "Thermodynamics",
      topics: [
        { name: "First Law", formula: "ΔU = q + w" },
        { name: "Enthalpy", formula: "ΔH = ΔU + ΔnRT" },
        { name: "Gibbs Free Energy", formula: "ΔG = ΔH - TΔS" },
        { name: "Hess's Law", formula: "ΔH = ΣΔH_products - ΣΔH_reactants" }
      ]
    },
    {
      chapter: "Equilibrium",
      topics: [
        { name: "Law of Mass Action", formula: "Kc = [products]/[reactants]" },
        { name: "Le Chatelier's Principle", formula: "System opposes change" },
        { name: "pH Scale", formula: "pH = -log[H⁺]" },
        { name: "Buffer Solution", formula: "pH = pKa + log([A⁻]/[HA])" }
      ]
    },
    {
      chapter: "Electrochemistry",
      topics: [
        { name: "Faraday's Laws", formula: "m = ZIt" },
        { name: "Nernst Equation", formula: "E = E° - (RT/nF)lnQ" },
        { name: "Cell EMF", formula: "E_cell = E_cathode - E_anode" },
        { name: "Kohlrausch's Law", formula: "Λ°m = Σλ°ions" }
      ]
    },
    {
      chapter: "Organic Chemistry Basics",
      topics: [
        { name: "IUPAC Nomenclature", formula: "Parent chain + substituents" },
        { name: "Isomerism", formula: "Structural and Stereoisomerism" },
        { name: "Reaction Mechanisms", formula: "SN1, SN2, E1, E2" },
        { name: "Inductive Effect", formula: "+I and -I groups" }
      ]
    },
    {
      chapter: "Hydrocarbons",
      topics: [
        { name: "Alkanes", formula: "CnH2n+2 — substitution reactions" },
        { name: "Alkenes", formula: "CnH2n — addition reactions" },
        { name: "Alkynes", formula: "CnH2n-2 — addition reactions" },
        { name: "Markovnikov's Rule", formula: "H adds to C with more H" }
      ]
    }
  ],
  maths: [
    {
      chapter: "Sets, Relations and Functions",
      topics: [
        { name: "Types of Sets", formula: "Empty, finite, infinite, equal sets" },
        { name: "Set Operations", formula: "A∪B, A∩B, A-B, A'" },
        { name: "Relations", formula: "Reflexive, symmetric, transitive" },
        { name: "Functions", formula: "One-one, onto, bijective" }
      ]
    },
    {
      chapter: "Complex Numbers",
      topics: [
        { name: "Imaginary Unit", formula: "i = √-1, i² = -1" },
        { name: "Modulus and Argument", formula: "|z| = √(a²+b²)" },
        { name: "De Moivre's Theorem", formula: "(cosθ + i sinθ)ⁿ = cos(nθ) + i sin(nθ)" },
        { name: "Cube Roots of Unity", formula: "1, ω, ω² where ω³ = 1" }
      ]
    },
    {
      chapter: "Quadratic Equations",
      topics: [
        { name: "Quadratic Formula", formula: "x = (-b ± √(b²-4ac))/2a" },
        { name: "Nature of Roots", formula: "D = b²-4ac" },
        { name: "Sum and Product of Roots", formula: "α+β = -b/a, αβ = c/a" },
        { name: "Formation of Equation", formula: "x² - (α+β)x + αβ = 0" }
      ]
    },
    {
      chapter: "Sequence and Series",
      topics: [
        { name: "AP", formula: "Sn = n/2[2a+(n-1)d]" },
        { name: "GP", formula: "Sn = a(rⁿ-1)/(r-1)" },
        { name: "AM-GM Inequality", formula: "AM ≥ GM ≥ HM" },
        { name: "Sum of Special Series", formula: "Σn = n(n+1)/2" }
      ]
    },
    {
      chapter: "Trigonometry",
      topics: [
        { name: "Basic Ratios", formula: "sin, cos, tan, cosec, sec, cot" },
        { name: "Pythagorean Identities", formula: "sin²θ + cos²θ = 1" },
        { name: "Compound Angles", formula: "sin(A+B) = sinAcosB + cosAsinB" },
        { name: "Multiple Angles", formula: "sin2θ = 2sinθcosθ" }
      ]
    },
    {
      chapter: "Coordinate Geometry",
      topics: [
        { name: "Distance Formula", formula: "d = √((x₂-x₁)²+(y₂-y₁)²)" },
        { name: "Straight Lines", formula: "y = mx+c" },
        { name: "Circles", formula: "(x-h)²+(y-k)² = r²" },
        { name: "Parabola", formula: "y² = 4ax" },
        { name: "Ellipse", formula: "x²/a² + y²/b² = 1" }
      ]
    },
    {
      chapter: "Calculus — Differentiation",
      topics: [
        { name: "Basic Derivatives", formula: "d/dx(xⁿ) = nxⁿ⁻¹" },
        { name: "Chain Rule", formula: "dy/dx = dy/du · du/dx" },
        { name: "Product Rule", formula: "d/dx(uv) = u'v + uv'" },
        { name: "Applications", formula: "Maxima, minima, rate of change" }
      ]
    },
    {
      chapter: "Calculus — Integration",
      topics: [
        { name: "Basic Integrals", formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C" },
        { name: "Integration by Parts", formula: "∫udv = uv - ∫vdu" },
        { name: "Definite Integrals", formula: "∫[a to b]f(x)dx = F(b)-F(a)" },
        { name: "Area under Curve", formula: "A = ∫[a to b]|f(x)|dx" }
      ]
    }
  ]
};
const boardsSyllabus = {
  physics: [
    {
      chapter: "Electric Charges and Fields",
      topics: [
        { name: "Electric Charges and Conservation", formula: "q = ne" },
        { name: "Coulomb's Law", formula: "F = kq₁q₂/r²" },
        { name: "Electric Field Lines", formula: "E = F/q" },
        { name: "Electric Flux", formula: "φ = E·A·cosθ" },
        { name: "Gauss's Law", formula: "∮E·dA = q/ε₀" },
      ]
    },
    {
      chapter: "Electrostatic Potential and Capacitance",
      topics: [
        { name: "Electric Potential", formula: "V = kQ/r" },
        { name: "Potential Difference", formula: "W = q(VA - VB)" },
        { name: "Equipotential Surfaces", formula: "Work done = 0 on equipotential" },
        { name: "Capacitance", formula: "C = Q/V" },
        { name: "Parallel Plate Capacitor", formula: "C = ε₀A/d" },
        { name: "Energy Stored", formula: "U = ½CV²" },
      ]
    },
    {
      chapter: "Current Electricity",
      topics: [
        { name: "Ohm's Law", formula: "V = IR" },
        { name: "Resistivity", formula: "R = ρL/A" },
        { name: "Temperature Dependence", formula: "ρ = ρ₀(1 + αΔT)" },
        { name: "EMF and Internal Resistance", formula: "V = E - Ir" },
        { name: "Kirchhoff's Laws", formula: "ΣI = 0, ΣV = 0" },
        { name: "Wheatstone Bridge", formula: "P/Q = R/S" },
        { name: "Meter Bridge", formula: "R/S = l/(100-l)" },
      ]
    },
    {
      chapter: "Moving Charges and Magnetism",
      topics: [
        { name: "Lorentz Force", formula: "F = q(v×B)" },
        { name: "Biot-Savart Law", formula: "dB = μ₀Idl sinθ/4πr²" },
        { name: "Ampere's Law", formula: "∮B·dl = μ₀I" },
        { name: "Force Between Parallel Wires", formula: "F/L = μ₀I₁I₂/2πd" },
        { name: "Galvanometer to Ammeter/Voltmeter", formula: "Shunt S = IgG/(I-Ig)" },
      ]
    },
    {
      chapter: "Magnetism and Matter",
      topics: [
        { name: "Bar Magnet", formula: "B = μ₀/4π · 2M/r³ (axial)" },
        { name: "Magnetic Intensity", formula: "B = μ₀(H + M)" },
        { name: "Dia, Para, Ferromagnetic", formula: "Properties and examples" },
        { name: "Hysteresis", formula: "Energy loss = area of B-H loop" },
      ]
    },
    {
      chapter: "Electromagnetic Induction",
      topics: [
        { name: "Faraday's Law", formula: "ε = -dΦ/dt" },
        { name: "Lenz's Law", formula: "Induced current opposes change" },
        { name: "Self Inductance", formula: "ε = -L(dI/dt)" },
        { name: "Mutual Inductance", formula: "ε = -M(dI/dt)" },
        { name: "AC Generator", formula: "ε = NBAω sin(ωt)" },
      ]
    },
    {
      chapter: "Alternating Current",
      topics: [
        { name: "RMS Values", formula: "Vrms = V₀/√2" },
        { name: "Reactance", formula: "XL = ωL, XC = 1/ωC" },
        { name: "Impedance", formula: "Z = √(R² + (XL-XC)²)" },
        { name: "Resonance", formula: "ω₀ = 1/√(LC)" },
        { name: "Power Factor", formula: "P = VrmsIrms cosφ" },
        { name: "Transformer", formula: "Vs/Vp = Ns/Np" },
      ]
    },
    {
      chapter: "Electromagnetic Waves",
      topics: [
        { name: "Displacement Current", formula: "Id = ε₀ dΦE/dt" },
        { name: "EM Spectrum", formula: "Radio → Micro → IR → Visible → UV → X → Gamma" },
        { name: "Speed of EM Waves", formula: "c = 1/√(μ₀ε₀)" },
        { name: "Properties of EM Waves", formula: "Transverse, travel in vacuum" },
      ]
    },
    {
      chapter: "Ray Optics",
      topics: [
        { name: "Reflection Laws", formula: "i = r" },
        { name: "Mirror Formula", formula: "1/f = 1/v + 1/u" },
        { name: "Refraction and Snell's Law", formula: "n₁sinθ₁ = n₂sinθ₂" },
        { name: "Total Internal Reflection", formula: "sinC = 1/n" },
        { name: "Lens Formula", formula: "1/f = 1/v - 1/u" },
        { name: "Lensmaker's Equation", formula: "1/f = (n-1)(1/R₁ - 1/R₂)" },
        { name: "Optical Instruments", formula: "m = -v/u" },
      ]
    },
    {
      chapter: "Wave Optics",
      topics: [
        { name: "Huygens Principle", formula: "Wavefront construction" },
        { name: "Young's Double Slit", formula: "β = λD/d" },
        { name: "Interference", formula: "Constructive: path diff = nλ" },
        { name: "Diffraction", formula: "a sinθ = nλ" },
        { name: "Polarisation", formula: "Malus Law: I = I₀cos²θ" },
      ]
    },
    {
      chapter: "Dual Nature of Matter",
      topics: [
        { name: "Photoelectric Effect", formula: "KE = hf - φ" },
        { name: "de Broglie Wavelength", formula: "λ = h/mv" },
        { name: "Davisson-Germer Experiment", formula: "Confirms wave nature of electrons" },
      ]
    },
    {
      chapter: "Atoms and Nuclei",
      topics: [
        { name: "Bohr's Model", formula: "E_n = -13.6/n² eV" },
        { name: "Spectral Series", formula: "1/λ = R(1/n₁² - 1/n₂²)" },
        { name: "Nuclear Binding Energy", formula: "BE = Δm × 931.5 MeV" },
        { name: "Radioactivity", formula: "N = N₀e^(-λt)" },
        { name: "Half Life", formula: "T½ = 0.693/λ" },
      ]
    },
    {
      chapter: "Semiconductor Electronics",
      topics: [
        { name: "Energy Bands", formula: "Conductor, Semiconductor, Insulator" },
        { name: "p-n Junction Diode", formula: "Forward and reverse bias" },
        { name: "Rectifier", formula: "Half wave and full wave" },
        { name: "Zener Diode", formula: "Voltage regulation" },
        { name: "Transistor", formula: "IE = IB + IC" },
        { name: "Logic Gates", formula: "AND, OR, NOT, NAND, NOR" },
      ]
    },
  ],
  chemistry: [
    {
      chapter: "Solutions",
      topics: [
        { name: "Types of Solutions", formula: "Solute + Solvent = Solution" },
        { name: "Concentration Terms", formula: "Molarity M = n/V(L)" },
        { name: "Raoult's Law", formula: "p = x·p°" },
        { name: "Colligative Properties", formula: "ΔTb = Kb·m" },
        { name: "Osmotic Pressure", formula: "π = MRT" },
        { name: "Van't Hoff Factor", formula: "i = observed/expected moles" },
      ]
    },
    {
      chapter: "Electrochemistry",
      topics: [
        { name: "Electrochemical Cell", formula: "E_cell = E_cathode - E_anode" },
        { name: "Nernst Equation", formula: "E = E° - (RT/nF)lnQ" },
        { name: "Conductance", formula: "G = 1/R" },
        { name: "Faraday's Laws", formula: "m = ZIt" },
        { name: "Kohlrausch's Law", formula: "Λ°m = Σλ°ions" },
        { name: "Corrosion", formula: "Oxidation at anode, reduction at cathode" },
      ]
    },
    {
      chapter: "Chemical Kinetics",
      topics: [
        { name: "Rate of Reaction", formula: "r = -d[A]/dt" },
        { name: "Order of Reaction", formula: "r = k[A]^m[B]^n" },
        { name: "Integrated Rate Laws", formula: "Zero: [A] = [A]₀ - kt" },
        { name: "Half Life", formula: "t½ = 0.693/k (first order)" },
        { name: "Arrhenius Equation", formula: "k = Ae^(-Ea/RT)" },
      ]
    },
    {
      chapter: "d and f Block Elements",
      topics: [
        { name: "Transition Elements Properties", formula: "Variable oxidation states" },
        { name: "Important Compounds", formula: "KMnO₄, K₂Cr₂O₇" },
        { name: "Lanthanoids", formula: "4f filling, lanthanoid contraction" },
        { name: "Actinoids", formula: "5f filling elements" },
      ]
    },
    {
      chapter: "Coordination Compounds",
      topics: [
        { name: "Werner's Theory", formula: "Primary and secondary valency" },
        { name: "IUPAC Nomenclature", formula: "ligands + central atom" },
        { name: "Isomerism", formula: "Structural and stereo isomerism" },
        { name: "Bonding — VBT and CFT", formula: "Crystal field splitting Δ" },
        { name: "Importance", formula: "Haemoglobin, chlorophyll, catalysts" },
      ]
    },
    {
      chapter: "Haloalkanes and Haloarenes",
      topics: [
        { name: "Nomenclature", formula: "IUPAC naming" },
        { name: "SN1 and SN2 Reactions", formula: "Nucleophilic substitution" },
        { name: "Elimination Reactions", formula: "E1, E2 mechanisms" },
        { name: "Optical Isomerism", formula: "R and S configuration" },
      ]
    },
    {
      chapter: "Alcohols, Phenols and Ethers",
      topics: [
        { name: "Preparation Methods", formula: "From alkenes, carbonyl compounds" },
        { name: "Chemical Properties", formula: "Oxidation, esterification" },
        { name: "Phenol Reactions", formula: "Electrophilic substitution" },
        { name: "Ethers", formula: "Williamson synthesis" },
      ]
    },
    {
      chapter: "Aldehydes, Ketones and Carboxylic Acids",
      topics: [
        { name: "Nucleophilic Addition", formula: "Carbonyl + Nu → product" },
        { name: "Aldol Condensation", formula: "2CH₃CHO → CH₃CH(OH)CH₂CHO" },
        { name: "Cannizzaro Reaction", formula: "Disproportionation of aldehyde" },
        { name: "Carboxylic Acid Reactions", formula: "Esterification, decarboxylation" },
      ]
    },
    {
      chapter: "Amines",
      topics: [
        { name: "Classification", formula: "Primary, secondary, tertiary" },
        { name: "Basicity", formula: "Kb values comparison" },
        { name: "Diazonium Salts", formula: "ArN₂⁺Cl⁻ reactions" },
        { name: "Preparation", formula: "Reduction of nitro compounds" },
      ]
    },
    {
      chapter: "Biomolecules",
      topics: [
        { name: "Carbohydrates", formula: "Glucose C₆H₁₂O₆" },
        { name: "Proteins", formula: "Amino acids linked by peptide bonds" },
        { name: "Enzymes", formula: "Biological catalysts" },
        { name: "Nucleic Acids", formula: "DNA and RNA structure" },
        { name: "Vitamins and Hormones", formula: "Fat and water soluble vitamins" },
      ]
    },
    {
      chapter: "Polymers",
      topics: [
        { name: "Classification", formula: "Natural vs synthetic, addition vs condensation" },
        { name: "Important Polymers", formula: "Nylon, Teflon, Bakelite, PVC" },
        { name: "Rubber", formula: "Natural and synthetic rubber" },
        { name: "Biodegradable Polymers", formula: "PHBV, Nylon-2-nylon-6" },
      ]
    },
    {
      chapter: "Chemistry in Everyday Life",
      topics: [
        { name: "Drugs and Medicines", formula: "Analgesics, antibiotics, antacids" },
        { name: "Chemicals in Food", formula: "Preservatives, antioxidants" },
        { name: "Cleansing Agents", formula: "Soaps and detergents" },
      ]
    },
  ],
  maths: [
    {
      chapter: "Relations and Functions",
      topics: [
        { name: "Types of Relations", formula: "Reflexive, symmetric, transitive, equivalence" },
        { name: "Types of Functions", formula: "One-one, onto, bijective" },
        { name: "Composition of Functions", formula: "fog(x) = f(g(x))" },
        { name: "Inverse Functions", formula: "f(f⁻¹(x)) = x" },
        { name: "Binary Operations", formula: "Closure, associativity, identity" },
      ]
    },
    {
      chapter: "Inverse Trigonometric Functions",
      topics: [
        { name: "Principal Value Branch", formula: "sin⁻¹: [-π/2, π/2]" },
        { name: "Properties", formula: "sin⁻¹(-x) = -sin⁻¹(x)" },
        { name: "Identities", formula: "sin⁻¹x + cos⁻¹x = π/2" },
      ]
    },
    {
      chapter: "Matrices",
      topics: [
        { name: "Types of Matrices", formula: "Row, column, square, diagonal, identity" },
        { name: "Matrix Operations", formula: "Addition, subtraction, multiplication" },
        { name: "Transpose", formula: "(AB)ᵀ = BᵀAᵀ" },
        { name: "Symmetric and Skew", formula: "A = Aᵀ and A = -Aᵀ" },
      ]
    },
    {
      chapter: "Determinants",
      topics: [
        { name: "Properties of Determinants", formula: "Row/column operations" },
        { name: "Cofactors and Minors", formula: "Cij = (-1)^(i+j) Mij" },
        { name: "Inverse of Matrix", formula: "A⁻¹ = adjA/|A|" },
        { name: "Cramer's Rule", formula: "x = D₁/D, y = D₂/D" },
      ]
    },
    {
      chapter: "Continuity and Differentiability",
      topics: [
        { name: "Continuity", formula: "lim f(x) = f(a) as x→a" },
        { name: "Differentiability", formula: "LHD = RHD" },
        { name: "Chain Rule", formula: "dy/dx = dy/du · du/dx" },
        { name: "Implicit Differentiation", formula: "d/dx f(x,y) = 0" },
        { name: "Logarithmic Differentiation", formula: "y = xˣ → lny = xlnx" },
        { name: "Second Order Derivatives", formula: "d²y/dx²" },
      ]
    },
    {
      chapter: "Applications of Derivatives",
      topics: [
        { name: "Rate of Change", formula: "dy/dt = (dy/dx)(dx/dt)" },
        { name: "Increasing/Decreasing", formula: "f'(x) > 0 increasing" },
        { name: "Tangents and Normals", formula: "slope = dy/dx at point" },
        { name: "Maxima and Minima", formula: "f'(x) = 0, check f''(x)" },
        { name: "Approximations", formula: "Δy ≈ f'(x)Δx" },
      ]
    },
    {
      chapter: "Integrals",
      topics: [
        { name: "Standard Integrals", formula: "∫xⁿdx = xⁿ⁺¹/(n+1) + C" },
        { name: "Integration by Substitution", formula: "∫f(g(x))g'(x)dx" },
        { name: "Integration by Parts", formula: "∫udv = uv - ∫vdu" },
        { name: "Partial Fractions", formula: "P(x)/Q(x) decomposition" },
        { name: "Definite Integrals", formula: "∫[a,b]f(x)dx = F(b)-F(a)" },
      ]
    },
    {
      chapter: "Applications of Integrals",
      topics: [
        { name: "Area Under Curve", formula: "A = ∫[a,b]f(x)dx" },
        { name: "Area Between Curves", formula: "A = ∫[a,b](f(x)-g(x))dx" },
      ]
    },
    {
      chapter: "Differential Equations",
      topics: [
        { name: "Order and Degree", formula: "Highest derivative = order" },
        { name: "Variable Separable", formula: "f(x)dx = g(y)dy" },
        { name: "Homogeneous Equations", formula: "y = vx substitution" },
        { name: "Linear Differential Equations", formula: "dy/dx + Py = Q, IF = e^∫Pdx" },
      ]
    },
    {
      chapter: "Vector Algebra",
      topics: [
        { name: "Types of Vectors", formula: "Zero, unit, equal, collinear" },
        { name: "Dot Product", formula: "a·b = |a||b|cosθ" },
        { name: "Cross Product", formula: "|a×b| = |a||b|sinθ" },
        { name: "Scalar Triple Product", formula: "[a b c] = a·(b×c)" },
      ]
    },
    {
      chapter: "Three Dimensional Geometry",
      topics: [
        { name: "Direction Cosines", formula: "l²+m²+n² = 1" },
        { name: "Equation of Line", formula: "(x-x₁)/l = (y-y₁)/m = (z-z₁)/n" },
        { name: "Equation of Plane", formula: "ax+by+cz = d" },
        { name: "Distance Formulas", formula: "Point to plane = |ax₁+by₁+cz₁-d|/√(a²+b²+c²)" },
        { name: "Angle Between Lines/Planes", formula: "cosθ = |l₁l₂+m₁m₂+n₁n₂|" },
      ]
    },
    {
      chapter: "Linear Programming",
      topics: [
        { name: "LPP Formulation", formula: "Objective function + constraints" },
        { name: "Graphical Method", formula: "Feasible region corner points" },
        { name: "Optimal Solution", formula: "Max/min at corner points" },
      ]
    },
    {
      chapter: "Probability",
      topics: [
        { name: "Conditional Probability", formula: "P(A|B) = P(A∩B)/P(B)" },
        { name: "Bayes Theorem", formula: "P(A|B) = P(B|A)P(A)/P(B)" },
        { name: "Random Variables", formula: "E(X) = Σx·P(x)" },
        { name: "Binomial Distribution", formula: "P(X=r) = ⁿCr·pʳ·qⁿ⁻ʳ" },
      ]
    },
  ]
};

window.onload = async function() {
  await checkLoginStatus();
};

async function checkLoginStatus() {
  try {
    const res = await fetch('/api/user');
    const user = await res.json();
    if (user.logged_in) {
      userName = user.name;

      const saved = JSON.parse(localStorage.getItem('jeemaxxer_setup') || '{}');
      examTarget = saved.examTarget || user.exam_target || '';
      daysLeft = saved.daysLeft || user.days_left || '';

      completedTopics = JSON.parse(localStorage.getItem('completedTopics') || '{}');

      conversationHistory = JSON.parse(localStorage.getItem('chatHistory') || '[]');

      const ban = JSON.parse(localStorage.getItem('banStatus') || '{}');
      if (ban.isBanned && ban.banEndTime > Date.now()) {
        isBanned = true;
        banEndTime = ban.banEndTime;
        warningCount = ban.warningCount || 2;
      } else {
        warningCount = ban.warningCount || 0;
      }

      if (!examTarget || !daysLeft) {
        showScreen('onboarding');
      } else {
        setupDashboard();
        showScreen('dashboard');
      }
    } else {
      showScreen('landing');
    }
  } catch (e) {
    showScreen('landing');
  }
}

function setupDashboard() {
  document.getElementById('dashWelcome').textContent = `Hey ${userName.split(' ')[0]}! 👋`;
  document.getElementById('dashExam').textContent = `${examTarget} • ${daysLeft} days left`;
  document.getElementById('dashDays').textContent = daysLeft;
  document.getElementById('dashStreak').textContent = `🔥 Day 1`;
  updateProgress();
}

async function saveSetup() {
  examTarget = document.getElementById('examType').value;
  daysLeft = document.getElementById('daysLeft').value;
  const boardType = document.getElementById('boardType')?.value || '';
  let struggle = document.getElementById('struggle').value;
  if (struggle === 'other') {
    struggle = document.getElementById('otherStruggle').value || 'general struggles';
  }
  if (!examTarget || !daysLeft || !struggle) {
    alert('Please fill all fields bhai! 🙏');
    return;
  }
  localStorage.setItem('jeemaxxer_setup', JSON.stringify({ examTarget, daysLeft, struggle, boardType }));
  try {
    await fetch('/api/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examTarget, daysLeft, struggle, boardType })
    });
  } catch (e) {}
  setupDashboard();
  showScreen('dashboard');
}

async function logout() {
  await fetch('/api/logout', { method: 'POST' });
  localStorage.removeItem('jeemaxxer_setup');
  localStorage.removeItem('completedTopics');
  localStorage.removeItem('chatHistory');
  localStorage.removeItem('banStatus');
  userName = '';
  examTarget = '';
  daysLeft = '';
  conversationHistory = [];
  completedTopics = {};
  showScreen('landing');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'syllabus') initSyllabus();
  if (id === 'dashboard') updateProgress();
  if (id === 'chat') restoreChatHistory();
}

function restoreChatHistory() {
  const msgs = document.getElementById('messages');
  if (msgs.children.length === 0 && conversationHistory.length > 0) {
    conversationHistory.forEach(msg => {
      if (msg.role === 'user') addUserMsg(msg.content);
      else addBotMsg(msg.content);
    });
  }
}

function toggleOther(select) {
  const otherGroup = document.getElementById('otherGroup');
  otherGroup.style.display = select.value === 'other' ? 'block' : 'none';
}

function toggleBoard() {
  const val = document.getElementById('examType').value;
  const boardGroup = document.getElementById('boardGroup');
  if (val.includes('12th') || val.includes('Boards')) {
    boardGroup.style.display = 'block';
  } else {
    boardGroup.style.display = 'none';
  }
}

function getTotalTopics() {
  let total = 0;
  Object.values(syllabus).forEach(subject => {
    subject.forEach(chapter => { total += chapter.topics.length; });
  });
  return total;
}

function getCompletedCount() {
  return Object.values(completedTopics).filter(Boolean).length;
}

function updateProgress() {
  const total = getTotalTopics();
  const completed = getCompletedCount();
  const percent = Math.round((completed / total) * 100);
  const bar = document.getElementById('overallProgress');
  const label = document.getElementById('progressLabel');
  const syllabusProgress = document.getElementById('syllabusProgress');
  if (bar) bar.style.width = percent + '%';
  if (label) label.textContent = `${completed} of ${total} topics completed`;
  if (syllabusProgress) syllabusProgress.textContent = `${percent}% Complete`;
}

function switchTab(tab, event) {
  currentTab = tab;
  document.querySelectorAll('.subject-subtabs .tab, .subject-tabs .tab').forEach(t => {
    if (t.closest('.subject-subtabs')) t.classList.remove('active');
  });
  if (event) event.target.classList.add('active');
  if (currentMode === 'jee') renderSyllabus(tab);
  else renderSyllabusInner(tab, currentMode);
}

function getSyllabusMode() {
  const saved = JSON.parse(localStorage.getItem('jeemaxxer_setup') || '{}');
  const exam = saved.examTarget || '';
  if (exam.includes('Only 12th')) return 'boards';
  if (exam.includes('12th') || exam.includes('Boards')) return 'both';
  return 'jee';
}

function initSyllabus() {
  const mode = getSyllabusMode();
  const tabsContainer = document.querySelector('.subject-tabs');

  if (mode === 'both') {
    tabsContainer.innerHTML = `
      <button class="tab active" onclick="switchMode('jee', event)">🎯 JEE</button>
      <button class="tab" onclick="switchMode('boards', event)">📋 Boards</button>
    `;
    currentMode = 'jee';
    currentTab = 'physics';
    renderSubjectTabs('jee');
  } else if (mode === 'boards') {
    tabsContainer.innerHTML = `
      <button class="tab active" onclick="switchMode('boards', event)">📋 Boards</button>
    `;
    currentMode = 'boards';
    currentTab = 'physics';
    renderSubjectTabs('boards');
  } else {
    tabsContainer.innerHTML = `
      <button class="tab active" onclick="switchTab('physics', event)">⚛️ Physics</button>
      <button class="tab" onclick="switchTab('chemistry', event)">🧪 Chemistry</button>
      <button class="tab" onclick="switchTab('maths', event)">📐 Maths</button>
    `;
    currentMode = 'jee';
    renderSyllabus('physics');
  }
}

let currentMode = 'jee';

function switchMode(mode, event) {
  currentMode = mode;
  currentTab = 'physics';
  document.querySelectorAll('.subject-tabs .tab').forEach(t => t.classList.remove('active'));
  if (event) event.target.classList.add('active');
  renderSubjectTabs(mode);
}

function renderSubjectTabs(mode) {
  const container = document.getElementById('syllabusContent');
  container.innerHTML = `
    <div class="subject-subtabs" style="display:flex; gap:8px; margin-bottom:1rem;">
      <button class="tab active" onclick="switchTab('physics', event)">⚛️ Physics</button>
      <button class="tab" onclick="switchTab('chemistry', event)">🧪 Chemistry</button>
      <button class="tab" onclick="switchTab('maths', event)">📐 Maths</button>
    </div>
    <div id="subjectContent"></div>
  `;
  renderSyllabusInner('physics', mode);
}

function renderSyllabus(subject) {
  const container = document.getElementById('syllabusContent');
  container.innerHTML = '';
  syllabus[subject].forEach((chapter, ci) => {
    const completed = chapter.topics.filter(
      t => completedTopics[`${subject}_${ci}_${t.name}`]
    ).length;
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML = `
      <div class="chapter-header" onclick="toggleChapter(this)">
        <div class="chapter-name">${chapter.chapter}</div>
        <div class="chapter-meta">
          <span class="chapter-count">${completed}/${chapter.topics.length}</span>
          <span class="chapter-arrow">▼</span>
        </div>
      </div>
      <div class="topics-list">
        ${chapter.topics.map((topic, ti) => {
          const key = `${subject}_${ci}_${topic.name}`;
          const done = completedTopics[key] || false;
          return `
            <div class="topic-item ${done ? 'topic-done' : ''}" id="topic_${subject}_${ci}_${ti}">
              <input type="checkbox" class="topic-checkbox" ${done ? 'checked' : ''}
                onchange="toggleTopic('${subject}', ${ci}, ${ti}, '${topic.name}', this)"/>
              <div class="topic-info">
                <div class="topic-name">${topic.name}</div>
                <span class="topic-formula">${topic.formula}</span>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

function renderSyllabusInner(subject, mode) {
  const data = mode === 'boards' ? boardsSyllabus : syllabus;
  const container = document.getElementById('subjectContent') || document.getElementById('syllabusContent');
  container.innerHTML = '';
  data[subject].forEach((chapter, ci) => {
    const prefix = `${mode}_${subject}`;
    const completed = chapter.topics.filter(
      t => completedTopics[`${prefix}_${ci}_${t.name}`]
    ).length;
    const card = document.createElement('div');
    card.className = 'chapter-card';
    card.innerHTML = `
      <div class="chapter-header" onclick="toggleChapter(this)">
        <div class="chapter-name">${chapter.chapter}</div>
        <div class="chapter-meta">
          <span class="chapter-count">${completed}/${chapter.topics.length}</span>
          <span class="chapter-arrow">▼</span>
        </div>
      </div>
      <div class="topics-list">
        ${chapter.topics.map((topic, ti) => {
          const key = `${prefix}_${ci}_${topic.name}`;
          const done = completedTopics[key] || false;
          return `
            <div class="topic-item ${done ? 'topic-done' : ''}" id="topic_${prefix}_${ci}_${ti}">
              <input type="checkbox" class="topic-checkbox" ${done ? 'checked' : ''}
                onchange="toggleTopic('${prefix}', ${ci}, ${ti}, '${topic.name}', this)"/>
              <div class="topic-info">
                <div class="topic-name">${topic.name}</div>
                <span class="topic-formula">${topic.formula}</span>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
    container.appendChild(card);
  });
}

function toggleChapter(header) {
  const topicsList = header.nextElementSibling;
  const arrow = header.querySelector('.chapter-arrow');
  topicsList.classList.toggle('open');
  arrow.classList.toggle('open');
}

function toggleTopic(subject, ci, ti, topicName, checkbox) {
  const key = `${subject}_${ci}_${topicName}`;
  completedTopics[key] = checkbox.checked;
  localStorage.setItem('completedTopics', JSON.stringify(completedTopics));
  const topicItem = document.getElementById(`topic_${subject}_${ci}_${ti}`);
  if (checkbox.checked) topicItem.classList.add('topic-done');
  else topicItem.classList.remove('topic-done');
  updateProgress();
}

function containsGaali(text) {
  const lower = text.toLowerCase();
  return badWords.some(word => lower.includes(word));
}

function checkBanStatus() {
  if (isBanned && banEndTime) {
    const remaining = Math.ceil((banEndTime - Date.now()) / 1000);
    if (remaining <= 0) {
      isBanned = false;
      banEndTime = null;
      warningCount = 0;
      saveBanStatus();
      const input = document.getElementById('chatInput');
      if (input) {
        input.disabled = false;
        input.placeholder = 'Ask JEEmaXXer anything...';
      }
      return false;
    }
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const input = document.getElementById('chatInput');
    if (input) input.placeholder = `🚫 Banned for ${mins}m ${secs}s — chill kar bhai`;
    return true;
  }
  return false;
}

function saveBanStatus() {
  localStorage.setItem('banStatus', JSON.stringify({
    isBanned, banEndTime, warningCount
  }));
}

function addBotMsg(text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `
    <div class="msg-avatar">JX</div>
    <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMsg(text) {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="msg-avatar">JX</div>
    <div class="msg-bubble">
      <div class="typing"><span></span><span></span><span></span></div>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

async function getBotReply(userMessage) {
  try {
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        userName: userName,
        examTarget: examTarget,
        daysLeft: daysLeft,
        history: conversationHistory
      })
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    return "Bhai network issue aa gaya 😭 ek baar phir try kar!";
  }
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  if (checkBanStatus()) return;

  if (containsGaali(text)) {
    warningCount++;
    input.value = '';
    saveBanStatus();
    if (warningCount === 1) {
      addBotMsg("⚠️ Bhai ye JEE prep ka platform hai — thodi respect rakh. Ek warning ho gayi, ek aur aayi toh 10 min ke liye chat band 🙏");
      return;
    }
    if (warningCount >= 2) {
      addBotMsg("🚫 Done bhai — 10 minute ke liye chat band. Thanda ho ja, phir milte hain 😤");
      isBanned = true;
      banEndTime = Date.now() + (10 * 60 * 1000);
      saveBanStatus();
      input.disabled = true;
      input.placeholder = '🚫 10 min ban — chill kar bhai';
      const countdown = setInterval(() => {
        if (!checkBanStatus()) {
          clearInterval(countdown);
          addBotMsg("✅ Theek hai bhai — wapas aa gaya! Ab padhai karte hain? 🔥");
        }
      }, 1000);
      return;
    }
  }

  input.value = '';
  input.disabled = true;
  addUserMsg(text);
  conversationHistory.push({ role: 'user', content: text });
  localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
  showTyping();
  const reply = await getBotReply(text);
  removeTyping();
  addBotMsg(reply);
  input.disabled = false;
  input.focus();
  conversationHistory.push({ role: 'assistant', content: reply });
  localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}

async function sendQuick(text) {
  if (checkBanStatus()) return;
  if (containsGaali(text)) return;
  addUserMsg(text);
  conversationHistory.push({ role: 'user', content: text });
  localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
  showTyping();
  const reply = await getBotReply(text);
  removeTyping();
  addBotMsg(reply);
  conversationHistory.push({ role: 'assistant', content: reply });
  localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
}