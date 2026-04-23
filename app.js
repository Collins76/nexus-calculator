/* ==========================================
   NEXUS CALCULATOR - Smart AI Calculator
   ========================================== */

// ===== STATE MANAGEMENT =====
const state = {
    calculator: {
        currentValue: '0',
        expression: '',
        previousValue: null,
        operator: null,
        waitingForOperand: false,
        memory: 0,
        mode: 'standard',
        angleMode: 'DEG',
        history: [],
        programmerBase: 10,
        programmerValue: 0
    },
    settings: {
        sound: true,
        haptic: true,
        animations: true,
        liveRates: false,
        decimalPlaces: 4,
        voiceLang: 'en-US',
        theme: 'dark'
    },
    currency: {
        from: 'USD',
        to: 'EUR',
        amount: 1,
        rates: null,
        lastUpdate: null,
        presets: []
    },
    metric: {
        category: 'length',
        from: 'm',
        to: 'ft',
        amount: 1,
        presets: []
    }
};

// ===== CURRENCY DATA (60+ currencies) =====
const CURRENCIES = {
    USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1 },
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
    GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79 },
    JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 149.50 },
    CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.24 },
    AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.53 },
    CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.36 },
    CHF: { name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', rate: 0.88 },
    HKD: { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', rate: 7.82 },
    NZD: { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', rate: 1.65 },
    SEK: { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', rate: 10.55 },
    NOK: { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', rate: 10.70 },
    DKK: { name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰', rate: 6.85 },
    PLN: { name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱', rate: 4.02 },
    CZK: { name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿', rate: 23.15 },
    HUF: { name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺', rate: 358.50 },
    RON: { name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴', rate: 4.58 },
    BGN: { name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬', rate: 1.80 },
    HRK: { name: 'Croatian Kuna', symbol: 'kn', flag: '🇭🇷', rate: 6.95 },
    ISK: { name: 'Icelandic Króna', symbol: 'kr', flag: '🇮🇸', rate: 139.20 },
    RUB: { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺', rate: 92.50 },
    TRY: { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷', rate: 32.15 },
    UAH: { name: 'Ukrainian Hryvnia', symbol: '₴', flag: '🇺🇦', rate: 39.80 },
    INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.25 },
    KRW: { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', rate: 1340.50 },
    SGD: { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 1.34 },
    MYR: { name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', rate: 4.72 },
    THB: { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭', rate: 36.20 },
    IDR: { name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩', rate: 15680 },
    PHP: { name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭', rate: 56.30 },
    VND: { name: 'Vietnamese Dong', symbol: '₫', flag: '🇻🇳', rate: 24580 },
    TWD: { name: 'Taiwan Dollar', symbol: 'NT$', flag: '🇹🇼', rate: 31.45 },
    PKR: { name: 'Pakistani Rupee', symbol: '₨', flag: '🇵🇰', rate: 278.50 },
    BDT: { name: 'Bangladeshi Taka', symbol: '৳', flag: '🇧🇩', rate: 109.80 },
    LKR: { name: 'Sri Lankan Rupee', symbol: 'Rs', flag: '🇱🇰', rate: 318.20 },
    NPR: { name: 'Nepalese Rupee', symbol: '₨', flag: '🇳🇵', rate: 133.40 },
    MMK: { name: 'Myanmar Kyat', symbol: 'K', flag: '🇲🇲', rate: 2100 },
    KHR: { name: 'Cambodian Riel', symbol: '៛', flag: '🇰🇭', rate: 4080 },
    BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', rate: 5.05 },
    MXN: { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', rate: 17.15 },
    ARS: { name: 'Argentine Peso', symbol: '$', flag: '🇦🇷', rate: 855.50 },
    CLP: { name: 'Chilean Peso', symbol: '$', flag: '🇨🇱', rate: 945.20 },
    COP: { name: 'Colombian Peso', symbol: '$', flag: '🇨🇴', rate: 3920 },
    PEN: { name: 'Peruvian Sol', symbol: 'S/', flag: '🇵🇪', rate: 3.72 },
    UYU: { name: 'Uruguayan Peso', symbol: '$U', flag: '🇺🇾', rate: 39.15 },
    VES: { name: 'Venezuelan Bolívar', symbol: 'Bs', flag: '🇻🇪', rate: 36.25 },
    ZAR: { name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rate: 18.65 },
    EGP: { name: 'Egyptian Pound', symbol: '£', flag: '🇪🇬', rate: 47.85 },
    NGN: { name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', rate: 1450 },
    KES: { name: 'Kenyan Shilling', symbol: 'Sh', flag: '🇰🇪', rate: 131.20 },
    GHS: { name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭', rate: 14.80 },
    MAD: { name: 'Moroccan Dirham', symbol: 'DH', flag: '🇲🇦', rate: 9.95 },
    TND: { name: 'Tunisian Dinar', symbol: 'DT', flag: '🇹🇳', rate: 3.12 },
    DZD: { name: 'Algerian Dinar', symbol: 'DA', flag: '🇩🇿', rate: 134.50 },
    ETB: { name: 'Ethiopian Birr', symbol: 'Br', flag: '🇪🇹', rate: 57.25 },
    UGX: { name: 'Ugandan Shilling', symbol: 'Sh', flag: '🇺🇬', rate: 3755 },
    TZS: { name: 'Tanzanian Shilling', symbol: 'Sh', flag: '🇹🇿', rate: 2520 },
    AED: { name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 3.67 },
    SAR: { name: 'Saudi Riyal', symbol: '﷼', flag: '🇸🇦', rate: 3.75 },
    QAR: { name: 'Qatari Riyal', symbol: '﷼', flag: '🇶🇦', rate: 3.64 },
    KWD: { name: 'Kuwaiti Dinar', symbol: 'د.ك', flag: '🇰🇼', rate: 0.307 },
    BHD: { name: 'Bahraini Dinar', symbol: '.د.ب', flag: '🇧🇭', rate: 0.376 },
    OMR: { name: 'Omani Rial', symbol: '﷼', flag: '🇴🇲', rate: 0.385 },
    JOD: { name: 'Jordanian Dinar', symbol: 'JD', flag: '🇯🇴', rate: 0.709 },
    LBP: { name: 'Lebanese Pound', symbol: 'ل.ل', flag: '🇱🇧', rate: 89500 },
    ILS: { name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱', rate: 3.72 },
    IRR: { name: 'Iranian Rial', symbol: '﷼', flag: '🇮🇷', rate: 42000 },
    IQD: { name: 'Iraqi Dinar', symbol: 'ع.د', flag: '🇮🇶', rate: 1310 },
    KZT: { name: 'Kazakhstani Tenge', symbol: '₸', flag: '🇰🇿', rate: 448.20 },
    UZS: { name: 'Uzbekistani Som', symbol: 'лв', flag: '🇺🇿', rate: 12650 },
    BTC: { name: 'Bitcoin', symbol: '₿', flag: '₿', rate: 0.0000152 },
    ETH: { name: 'Ethereum', symbol: 'Ξ', flag: 'Ξ', rate: 0.000322 },
    XAU: { name: 'Gold (oz)', symbol: 'Au', flag: '🥇', rate: 0.000484 },
    XAG: { name: 'Silver (oz)', symbol: 'Ag', flag: '🥈', rate: 0.0413 }
};

// ===== METRIC CATEGORIES =====
const METRIC_CATEGORIES = {
    length: {
        name: 'Length',
        icon: '📏',
        units: {
            mm: { name: 'Millimeter', factor: 0.001 },
            cm: { name: 'Centimeter', factor: 0.01 },
            m: { name: 'Meter', factor: 1 },
            km: { name: 'Kilometer', factor: 1000 },
            in: { name: 'Inch', factor: 0.0254 },
            ft: { name: 'Foot', factor: 0.3048 },
            yd: { name: 'Yard', factor: 0.9144 },
            mi: { name: 'Mile', factor: 1609.344 },
            nmi: { name: 'Nautical Mile', factor: 1852 },
            ly: { name: 'Light Year', factor: 9.461e15 },
            au: { name: 'Astronomical Unit', factor: 1.496e11 },
            pc: { name: 'Parsec', factor: 3.086e16 },
            um: { name: 'Micrometer', factor: 1e-6 },
            nm: { name: 'Nanometer', factor: 1e-9 },
            angstrom: { name: 'Ångström', factor: 1e-10 },
            furlong: { name: 'Furlong', factor: 201.168 },
            chain: { name: 'Chain', factor: 20.1168 },
            rod: { name: 'Rod', factor: 5.0292 },
            fathom: { name: 'Fathom', factor: 1.8288 },
            league: { name: 'League', factor: 4828.032 }
        }
    },
    weight: {
        name: 'Weight',
        icon: '⚖️',
        units: {
            mg: { name: 'Milligram', factor: 1e-6 },
            g: { name: 'Gram', factor: 0.001 },
            kg: { name: 'Kilogram', factor: 1 },
            t: { name: 'Metric Ton', factor: 1000 },
            oz: { name: 'Ounce', factor: 0.0283495 },
            lb: { name: 'Pound', factor: 0.453592 },
            st: { name: 'Stone', factor: 6.35029 },
            ton_us: { name: 'US Ton', factor: 907.185 },
            ton_uk: { name: 'UK Ton', factor: 1016.05 },
            carat: { name: 'Carat', factor: 0.0002 },
            grain: { name: 'Grain', factor: 6.479891e-5 },
            dram: { name: 'Dram', factor: 0.00177185 },
            slug: { name: 'Slug', factor: 14.5939 },
            quintal: { name: 'Quintal', factor: 100 },
            troy_oz: { name: 'Troy Ounce', factor: 0.0311035 },
            troy_lb: { name: 'Troy Pound', factor: 0.373242 }
        }
    },
    temperature: {
        name: 'Temperature',
        icon: '🌡️',
        units: {
            C: { name: 'Celsius', factor: 1, special: true },
            F: { name: 'Fahrenheit', factor: 1, special: true },
            K: { name: 'Kelvin', factor: 1, special: true },
            R: { name: 'Rankine', factor: 1, special: true },
            Re: { name: 'Réaumur', factor: 1, special: true }
        }
    },
    volume: {
        name: 'Volume',
        icon: '🧪',
        units: {
            ml: { name: 'Milliliter', factor: 0.001 },
            l: { name: 'Liter', factor: 1 },
            m3: { name: 'Cubic Meter', factor: 1000 },
            cm3: { name: 'Cubic Centimeter', factor: 0.001 },
            mm3: { name: 'Cubic Millimeter', factor: 1e-6 },
            gal_us: { name: 'US Gallon', factor: 3.78541 },
            gal_uk: { name: 'UK Gallon', factor: 4.54609 },
            qt_us: { name: 'US Quart', factor: 0.946353 },
            qt_uk: { name: 'UK Quart', factor: 1.13652 },
            pt_us: { name: 'US Pint', factor: 0.473176 },
            pt_uk: { name: 'UK Pint', factor: 0.568261 },
            cup_us: { name: 'US Cup', factor: 0.236588 },
            cup_uk: { name: 'UK Cup', factor: 0.284131 },
            floz_us: { name: 'US Fluid Oz', factor: 0.0295735 },
            floz_uk: { name: 'UK Fluid Oz', factor: 0.0284131 },
            tbsp_us: { name: 'US Tablespoon', factor: 0.0147868 },
            tsp_us: { name: 'US Teaspoon', factor: 0.00492892 },
            barrel_oil: { name: 'Oil Barrel', factor: 158.987 },
            barrel_us: { name: 'US Barrel', factor: 119.24 },
            cubic_in: { name: 'Cubic Inch', factor: 0.0163871 },
            cubic_ft: { name: 'Cubic Foot', factor: 28.3168 },
            cubic_yd: { name: 'Cubic Yard', factor: 764.555 }
        }
    },
    area: {
        name: 'Area',
        icon: '⬜',
        units: {
            mm2: { name: 'Square Millimeter', factor: 1e-6 },
            cm2: { name: 'Square Centimeter', factor: 1e-4 },
            m2: { name: 'Square Meter', factor: 1 },
            km2: { name: 'Square Kilometer', factor: 1e6 },
            in2: { name: 'Square Inch', factor: 0.00064516 },
            ft2: { name: 'Square Foot', factor: 0.092903 },
            yd2: { name: 'Square Yard', factor: 0.836127 },
            mi2: { name: 'Square Mile', factor: 2.58999e6 },
            hectare: { name: 'Hectare', factor: 10000 },
            acre: { name: 'Acre', factor: 4046.86 },
            are: { name: 'Are', factor: 100 },
            rood: { name: 'Rood', factor: 1011.71 }
        }
    },
    speed: {
        name: 'Speed',
        icon: '🏎️',
        units: {
            ms: { name: 'Meter/Second', factor: 1 },
            kmh: { name: 'Kilometer/Hour', factor: 0.277778 },
            mph: { name: 'Mile/Hour', factor: 0.44704 },
            fps: { name: 'Foot/Second', factor: 0.3048 },
            knot: { name: 'Knot', factor: 0.514444 },
            mach: { name: 'Mach', factor: 343 },
            c: { name: 'Speed of Light', factor: 299792458 },
            kph: { name: 'Kilometer/Hour (alt)', factor: 0.277778 }
        }
    },
    time: {
        name: 'Time',
        icon: '⏱️',
        units: {
            ns: { name: 'Nanosecond', factor: 1e-9 },
            us: { name: 'Microsecond', factor: 1e-6 },
            ms: { name: 'Millisecond', factor: 0.001 },
            s: { name: 'Second', factor: 1 },
            min: { name: 'Minute', factor: 60 },
            h: { name: 'Hour', factor: 3600 },
            d: { name: 'Day', factor: 86400 },
            wk: { name: 'Week', factor: 604800 },
            mo: { name: 'Month', factor: 2628000 },
            yr: { name: 'Year', factor: 31536000 },
            decade: { name: 'Decade', factor: 315360000 },
            century: { name: 'Century', factor: 3153600000 },
            millennium: { name: 'Millennium', factor: 31536000000 }
        }
    },
    energy: {
        name: 'Energy',
        icon: '⚡',
        units: {
            J: { name: 'Joule', factor: 1 },
            kJ: { name: 'Kilojoule', factor: 1000 },
            MJ: { name: 'Megajoule', factor: 1e6 },
            cal: { name: 'Calorie', factor: 4.184 },
            kcal: { name: 'Kilocalorie', factor: 4184 },
            Wh: { name: 'Watt-hour', factor: 3600 },
            kWh: { name: 'Kilowatt-hour', factor: 3.6e6 },
            MWh: { name: 'Megawatt-hour', factor: 3.6e9 },
            BTU: { name: 'BTU', factor: 1055.06 },
            ftlb: { name: 'Foot-pound', factor: 1.35582 },
            eV: { name: 'Electron-volt', factor: 1.602e-19 },
            erg: { name: 'Erg', factor: 1e-7 },
            therm: { name: 'Therm', factor: 1.055e8 }
        }
    },
    pressure: {
        name: 'Pressure',
        icon: '💨',
        units: {
            Pa: { name: 'Pascal', factor: 1 },
            kPa: { name: 'Kilopascal', factor: 1000 },
            MPa: { name: 'Megapascal', factor: 1e6 },
            bar: { name: 'Bar', factor: 100000 },
            mbar: { name: 'Millibar', factor: 100 },
            psi: { name: 'PSI', factor: 6894.76 },
            atm: { name: 'Atmosphere', factor: 101325 },
            mmHg: { name: 'mmHg (Torr)', factor: 133.322 },
            inHg: { name: 'Inches Hg', factor: 3386.39 },
            inH2O: { name: 'Inches H2O', factor: 249.089 }
        }
    },
    data: {
        name: 'Data',
        icon: '💾',
        units: {
            bit: { name: 'Bit', factor: 0.125 },
            B: { name: 'Byte', factor: 1 },
            KB: { name: 'Kilobyte', factor: 1000 },
            MB: { name: 'Megabyte', factor: 1e6 },
            GB: { name: 'Gigabyte', factor: 1e9 },
            TB: { name: 'Terabyte', factor: 1e12 },
            PB: { name: 'Petabyte', factor: 1e15 },
            EB: { name: 'Exabyte', factor: 1e18 },
            KiB: { name: 'Kibibyte', factor: 1024 },
            MiB: { name: 'Mebibyte', factor: 1048576 },
            GiB: { name: 'Gibibyte', factor: 1073741824 },
            TiB: { name: 'Tebibyte', factor: 1.0995e12 }
        }
    },
    angle: {
        name: 'Angle',
        icon: '📐',
        units: {
            deg: { name: 'Degree', factor: 1 },
            rad: { name: 'Radian', factor: 57.2958 },
            grad: { name: 'Gradian', factor: 0.9 },
            turn: { name: 'Turn', factor: 360 },
            arcmin: { name: 'Arcminute', factor: 0.0166667 },
            arcsec: { name: 'Arcsecond', factor: 0.000277778 }
        }
    },
    frequency: {
        name: 'Frequency',
        icon: '📡',
        units: {
            Hz: { name: 'Hertz', factor: 1 },
            kHz: { name: 'Kilohertz', factor: 1000 },
            MHz: { name: 'Megahertz', factor: 1e6 },
            GHz: { name: 'Gigahertz', factor: 1e9 },
            THz: { name: 'Terahertz', factor: 1e12 },
            rpm: { name: 'RPM', factor: 1/60 }
        }
    },
    power: {
        name: 'Power',
        icon: '🔌',
        units: {
            W: { name: 'Watt', factor: 1 },
            kW: { name: 'Kilowatt', factor: 1000 },
            MW: { name: 'Megawatt', factor: 1e6 },
            GW: { name: 'Gigawatt', factor: 1e9 },
            hp: { name: 'Horsepower', factor: 745.7 },
            hp_metric: { name: 'Metric HP', factor: 735.5 },
            BTU_hr: { name: 'BTU/hour', factor: 0.293071 },
            ftlb_s: { name: 'Ft-lb/sec', factor: 1.35582 }
        }
    },
    fuel: {
        name: 'Fuel Economy',
        icon: '⛽',
        units: {
            mpg_us: { name: 'MPG (US)', factor: 1, special: true },
            mpg_uk: { name: 'MPG (UK)', factor: 1, special: true },
            km_l: { name: 'Km/Liter', factor: 1, special: true },
            l_100km: { name: 'L/100km', factor: 1, special: true }
        }
    },
    cooking: {
        name: 'Cooking',
        icon: '🍳',
        units: {
            tsp: { name: 'Teaspoon', factor: 4.92892 },
            tbsp: { name: 'Tablespoon', factor: 14.7868 },
            cup: { name: 'Cup', factor: 236.588 },
            pint: { name: 'Pint', factor: 473.176 },
            quart: { name: 'Quart', factor: 946.353 },
            ml: { name: 'Milliliter', factor: 1 },
            l: { name: 'Liter', factor: 1000 },
            floz: { name: 'Fluid Ounce', factor: 29.5735 },
            dash: { name: 'Dash', factor: 0.616115 },
            pinch: { name: 'Pinch', factor: 0.308058 }
        }
    }
};

// ===== STORAGE =====
const Storage = {
    save(key, data) {
        try {
            localStorage.setItem('nexus_' + key, JSON.stringify(data));
        } catch (e) { console.warn('Storage error:', e); }
    },
    load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem('nexus_' + key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) { return defaultValue; }
    },
    remove(key) {
        try { localStorage.removeItem('nexus_' + key); } catch (e) {}
    },
    clearAll() {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('nexus_'));
        keys.forEach(k => localStorage.removeItem(k));
    }
};

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastSlide 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ===== SOUND FEEDBACK =====
let audioCtx = null;
function playSound(frequency = 440, duration = 50, type = 'sine') {
    if (!state.settings.sound) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration/1000);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration/1000);
    } catch (e) {}
}

function hapticPulse(duration = 10) {
    if (!state.settings.haptic) return;
    if (navigator.vibrate) navigator.vibrate(duration);
}

// ===== CALCULATOR ENGINE =====
const Calculator = {
    formatNumber(num) {
        if (num === null || num === undefined || isNaN(num)) return '0';
        if (!isFinite(num)) return 'Error';
        const abs = Math.abs(num);
        if (abs !== 0 && (abs < 1e-10 || abs >= 1e16)) {
            return num.toExponential(state.settings.decimalPlaces);
        }
        const rounded = parseFloat(num.toPrecision(12));
        const str = rounded.toString();
        if (str.includes('.')) {
            const [intPart, decPart] = str.split('.');
            return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decPart;
        }
        return str.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    unformat(str) {
        return parseFloat(String(str).replace(/,/g, ''));
    },

    evaluate(expression) {
        try {
            let expr = expression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/−/g, '-')
                .replace(/,/g, '');

            // Handle factorial
            expr = expr.replace(/(\d+(?:\.\d+)?)!/g, (_, n) => {
                return String(this.factorial(parseFloat(n)));
            });

            // Handle percentage
            expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');

            // Validate
            if (!/^[\d+\-*/.()\s%Math.PIEeqrtlogsincatabpwxy!\^]+$/.test(expr)) {
                // Use Function for safer eval
            }

            const result = Function('"use strict"; return (' + expr + ')')();
            return result;
        } catch (e) {
            return NaN;
        }
    },

    factorial(n) {
        if (n < 0 || !Number.isInteger(n)) return NaN;
        if (n === 0 || n === 1) return 1;
        if (n > 170) return Infinity;
        let result = 1;
        for (let i = 2; i <= n; i++) result *= i;
        return result;
    },

    applyFunction(value, func) {
        const n = parseFloat(value);
        const rad = state.calculator.angleMode === 'DEG' ? n * Math.PI / 180 : n;
        switch (func) {
            case 'sin': return Math.sin(rad);
            case 'cos': return Math.cos(rad);
            case 'tan': return Math.tan(rad);
            case 'asin': return state.calculator.angleMode === 'DEG' ? Math.asin(n) * 180 / Math.PI : Math.asin(n);
            case 'acos': return state.calculator.angleMode === 'DEG' ? Math.acos(n) * 180 / Math.PI : Math.acos(n);
            case 'atan': return state.calculator.angleMode === 'DEG' ? Math.atan(n) * 180 / Math.PI : Math.atan(n);
            case 'log': return Math.log10(n);
            case 'ln': return Math.log(n);
            case 'sqrt': return Math.sqrt(n);
            case 'cbrt': return Math.cbrt(n);
            case 'exp': return Math.exp(n);
            case 'pow10': return Math.pow(10, n);
            case 'abs': return Math.abs(n);
            default: return n;
        }
    },

    updateDisplay() {
        const display = document.getElementById('display');
        const expression = document.getElementById('expression');
        const memIndicator = document.getElementById('memoryIndicator');

        display.textContent = state.calculator.currentValue;
        expression.textContent = state.calculator.expression;
        memIndicator.textContent = state.calculator.memory !== 0 ? 'M' : '';

        // Update programmer display
        if (state.calculator.mode === 'programmer') {
            this.updateProgrammerDisplay();
        }
    },

    updateProgrammerDisplay() {
        const val = Math.floor(this.unformat(state.calculator.currentValue) || 0);
        document.getElementById('hexDisplay').textContent = val.toString(16).toUpperCase();
        document.getElementById('decDisplay').textContent = val.toString(10);
        document.getElementById('octDisplay').textContent = val.toString(8);
        document.getElementById('binDisplay').textContent = val.toString(2);
    },

    handleAction(action, value = null) {
        hapticPulse();

        switch (action) {
            case 'number':
                if (state.calculator.currentValue === '0' || state.calculator.waitingForOperand) {
                    state.calculator.currentValue = value;
                    state.calculator.waitingForOperand = false;
                } else {
                    const raw = String(state.calculator.currentValue).replace(/,/g, '');
                    const newRaw = raw + value;
                    if (newRaw.length > 16) break;
                    if (newRaw.includes('.')) {
                        const [intPart, decPart] = newRaw.split('.');
                        const intNum = parseFloat(intPart) || 0;
                        state.calculator.currentValue = intNum.toLocaleString('en-US') + '.' + decPart;
                    } else {
                        state.calculator.currentValue = parseFloat(newRaw).toLocaleString('en-US');
                    }
                }
                playSound(600, 30);
                break;

            case 'decimal':
                if (state.calculator.waitingForOperand) {
                    state.calculator.currentValue = '0.';
                    state.calculator.waitingForOperand = false;
                } else if (!String(state.calculator.currentValue).includes('.')) {
                    state.calculator.currentValue = String(state.calculator.currentValue) + '.';
                }
                playSound(500, 30);
                break;

            case 'operator':
                this.handleOperator(value);
                playSound(450, 40);
                break;

            case 'equals':
                this.handleEquals();
                playSound(800, 80);
                break;

            case 'clear':
                state.calculator.currentValue = '0';
                state.calculator.expression = '';
                state.calculator.previousValue = null;
                state.calculator.operator = null;
                state.calculator.waitingForOperand = false;
                playSound(300, 50);
                break;

            case 'clear-entry':
                state.calculator.currentValue = '0';
                playSound(350, 40);
                break;

            case 'backspace':
                const curr = String(state.calculator.currentValue);
                if (curr.length > 1 && curr !== '0') {
                    state.calculator.currentValue = curr.slice(0, -1);
                } else {
                    state.calculator.currentValue = '0';
                }
                playSound(400, 30);
                break;

            case 'negate':
                const n = this.unformat(state.calculator.currentValue);
                state.calculator.currentValue = this.formatNumber(-n);
                break;

            case 'percent':
                const p = this.unformat(state.calculator.currentValue) / 100;
                state.calculator.currentValue = this.formatNumber(p);
                break;

            case 'sqrt':
                const sq = Math.sqrt(this.unformat(state.calculator.currentValue));
                state.calculator.expression = `√(${state.calculator.currentValue})`;
                state.calculator.currentValue = this.formatNumber(sq);
                this.addHistory(state.calculator.expression, state.calculator.currentValue);
                break;

            case 'square':
                const sq2 = Math.pow(this.unformat(state.calculator.currentValue), 2);
                state.calculator.expression = `(${state.calculator.currentValue})²`;
                state.calculator.currentValue = this.formatNumber(sq2);
                this.addHistory(state.calculator.expression, state.calculator.currentValue);
                break;

            case 'reciprocal':
                const rec = 1 / this.unformat(state.calculator.currentValue);
                state.calculator.expression = `1/(${state.calculator.currentValue})`;
                state.calculator.currentValue = this.formatNumber(rec);
                this.addHistory(state.calculator.expression, state.calculator.currentValue);
                break;

            case 'factorial':
                const f = this.factorial(this.unformat(state.calculator.currentValue));
                state.calculator.expression = `${state.calculator.currentValue}!`;
                state.calculator.currentValue = this.formatNumber(f);
                this.addHistory(state.calculator.expression, state.calculator.currentValue);
                break;

            case 'function':
                const fResult = this.applyFunction(this.unformat(state.calculator.currentValue), value);
                state.calculator.expression = `${value}(${state.calculator.currentValue})`;
                state.calculator.currentValue = this.formatNumber(fResult);
                this.addHistory(state.calculator.expression, state.calculator.currentValue);
                break;

            case 'constant':
                state.calculator.currentValue = this.formatNumber(eval(value));
                state.calculator.waitingForOperand = true;
                break;

            case 'power':
                state.calculator.previousValue = this.unformat(state.calculator.currentValue);
                state.calculator.operator = '**';
                state.calculator.expression = `${state.calculator.currentValue}^`;
                state.calculator.waitingForOperand = true;
                break;

            case 'memory-clear':
                state.calculator.memory = 0;
                showToast('Memory cleared', 'info', 1500);
                break;

            case 'memory-recall':
                state.calculator.currentValue = this.formatNumber(state.calculator.memory);
                state.calculator.waitingForOperand = true;
                break;

            case 'memory-store':
                state.calculator.memory = this.unformat(state.calculator.currentValue);
                showToast('Stored in memory', 'success', 1500);
                break;

            case 'memory-add':
                state.calculator.memory += this.unformat(state.calculator.currentValue);
                showToast('Added to memory', 'success', 1500);
                break;

            case 'memory-subtract':
                state.calculator.memory -= this.unformat(state.calculator.currentValue);
                showToast('Subtracted from memory', 'success', 1500);
                break;

            case 'rad-deg':
                state.calculator.angleMode = state.calculator.angleMode === 'DEG' ? 'RAD' : 'DEG';
                document.getElementById('angleMode').textContent = state.calculator.angleMode;
                showToast(`Angle mode: ${state.calculator.angleMode}`, 'info', 1500);
                break;

            case 'paren-open':
                state.calculator.currentValue = state.calculator.currentValue === '0' ? '(' : state.calculator.currentValue + '(';
                break;

            case 'paren-close':
                state.calculator.currentValue = state.calculator.currentValue + ')';
                break;

            case 'parenthesis':
                // Auto paren toggle
                const s = String(state.calculator.currentValue);
                const opens = (s.match(/\(/g) || []).length;
                const closes = (s.match(/\)/g) || []).length;
                if (opens > closes) {
                    state.calculator.currentValue += ')';
                } else {
                    state.calculator.currentValue = s === '0' ? '(' : s + '(';
                }
                break;

            case 'bitwise':
                this.handleBitwise(value);
                break;

            case 'hex':
                if (state.calculator.programmerBase === 16) {
                    if (state.calculator.currentValue === '0') {
                        state.calculator.currentValue = value;
                    } else {
                        state.calculator.currentValue += value;
                    }
                }
                break;
        }

        this.updateDisplay();
    },

    handleOperator(op) {
        const current = this.unformat(state.calculator.currentValue);
        if (state.calculator.previousValue !== null && !state.calculator.waitingForOperand) {
            this.handleEquals(true);
        } else {
            state.calculator.previousValue = current;
        }
        state.calculator.operator = op;
        state.calculator.waitingForOperand = true;
        state.calculator.expression = `${this.formatNumber(state.calculator.previousValue)} ${this.getOpSymbol(op)}`;
    },

    getOpSymbol(op) {
        const map = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': 'mod', '**': '^' };
        return map[op] || op;
    },

    handleEquals(chained = false) {
        if (state.calculator.operator === null || state.calculator.previousValue === null) return;
        const current = this.unformat(state.calculator.currentValue);
        let result;

        switch (state.calculator.operator) {
            case '+': result = state.calculator.previousValue + current; break;
            case '-': result = state.calculator.previousValue - current; break;
            case '*': result = state.calculator.previousValue * current; break;
            case '/':
                if (current === 0) {
                    state.calculator.currentValue = 'Error: Division by zero';
                    document.getElementById('display').classList.add('error');
                    setTimeout(() => document.getElementById('display').classList.remove('error'), 2000);
                    state.calculator.operator = null;
                    state.calculator.previousValue = null;
                    return;
                }
                result = state.calculator.previousValue / current; break;
            case '%': result = state.calculator.previousValue % current; break;
            case '**': result = Math.pow(state.calculator.previousValue, current); break;
        }

        const expr = `${this.formatNumber(state.calculator.previousValue)} ${this.getOpSymbol(state.calculator.operator)} ${this.formatNumber(current)}`;

        if (!chained) {
            this.addHistory(expr, this.formatNumber(result));
            state.calculator.expression = expr + ' =';
        }

        state.calculator.currentValue = this.formatNumber(result);
        state.calculator.previousValue = chained ? result : null;
        state.calculator.operator = chained ? state.calculator.operator : null;
        state.calculator.waitingForOperand = true;
    },

    handleBitwise(op) {
        const current = Math.floor(this.unformat(state.calculator.currentValue));
        if (op === 'NOT') {
            state.calculator.currentValue = String(~current);
            return;
        }
        if (state.calculator.previousValue !== null && !state.calculator.waitingForOperand) {
            // compute
        }
        state.calculator.previousValue = current;
        state.calculator.operator = op;
        state.calculator.waitingForOperand = true;
    },

    addHistory(expression, result) {
        state.calculator.history.unshift({
            expression,
            result,
            timestamp: Date.now()
        });
        if (state.calculator.history.length > 100) state.calculator.history.pop();
        Storage.save('history', state.calculator.history);
        this.renderHistory();
    },

    renderHistory() {
        const list = document.getElementById('historyList');
        if (state.calculator.history.length === 0) {
            list.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }
        list.innerHTML = state.calculator.history.map((item, i) => `
            <div class="history-item" data-index="${i}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">${item.result}</div>
            </div>
        `).join('');

        list.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.dataset.index);
                state.calculator.currentValue = state.calculator.history[idx].result;
                state.calculator.waitingForOperand = true;
                this.updateDisplay();
                showToast('Result loaded', 'success', 1200);
            });
        });
    },

    clearHistory() {
        state.calculator.history = [];
        Storage.save('history', []);
        this.renderHistory();
        showToast('History cleared', 'info', 1500);
    }
};

// ===== CURRENCY CONVERTER =====
const Currency = {
    init() {
        this.populateSelects();
        this.renderRates();
        this.renderPresets();
        this.convert();
        this.bindEvents();

        if (state.settings.liveRates) {
            this.fetchLiveRates();
        }
    },

    populateSelects() {
        const fromSel = document.getElementById('currencyFrom');
        const toSel = document.getElementById('currencyTo');
        const options = Object.entries(CURRENCIES).map(([code, data]) =>
            `<option value="${code}">${data.flag} ${code} - ${data.name}</option>`
        ).join('');
        fromSel.innerHTML = options;
        toSel.innerHTML = options;
        fromSel.value = state.currency.from;
        toSel.value = state.currency.to;
    },

    convert() {
        const amount = parseFloat(document.getElementById('currencyFromAmount').value) || 0;
        const from = document.getElementById('currencyFrom').value;
        const to = document.getElementById('currencyTo').value;

        const rates = state.currency.rates || CURRENCIES;
        const fromRate = rates[from]?.rate || CURRENCIES[from].rate;
        const toRate = rates[to]?.rate || CURRENCIES[to].rate;

        const usdAmount = amount / fromRate;
        const result = usdAmount * toRate;

        document.getElementById('currencyToAmount').value = result.toFixed(state.settings.decimalPlaces);

        const rateDisplay = document.getElementById('exchangeRate');
        const singleRate = (1 / fromRate) * toRate;
        rateDisplay.innerHTML = `
            <strong>1 ${from}</strong> = <strong>${singleRate.toFixed(state.settings.decimalPlaces)} ${to}</strong>
            <br>
            <span style="color: var(--text-muted); font-size: 11px;">
                ${CURRENCIES[from].symbol}${amount.toLocaleString()} → ${CURRENCIES[to].symbol}${result.toLocaleString(undefined, {maximumFractionDigits: state.settings.decimalPlaces})}
            </span>
        `;

        state.currency.from = from;
        state.currency.to = to;
        state.currency.amount = amount;
    },

    convertReverse() {
        const amount = parseFloat(document.getElementById('currencyToAmount').value) || 0;
        const from = document.getElementById('currencyFrom').value;
        const to = document.getElementById('currencyTo').value;

        const rates = state.currency.rates || CURRENCIES;
        const fromRate = rates[from]?.rate || CURRENCIES[from].rate;
        const toRate = rates[to]?.rate || CURRENCIES[to].rate;

        const usdAmount = amount / toRate;
        const result = usdAmount * fromRate;

        document.getElementById('currencyFromAmount').value = result.toFixed(state.settings.decimalPlaces);
        this.convert();
    },

    swap() {
        const fromSel = document.getElementById('currencyFrom');
        const toSel = document.getElementById('currencyTo');
        [fromSel.value, toSel.value] = [toSel.value, fromSel.value];
        this.convert();

        // Animate swap
        document.getElementById('currencySwap').style.animation = 'none';
        requestAnimationFrame(() => {
            document.getElementById('currencySwap').style.animation = 'btnPress 0.4s ease';
        });
    },

    renderRates() {
        const grid = document.getElementById('ratesGrid');
        const popular = ['EUR', 'GBP', 'JPY', 'CNY', 'AUD', 'CAD', 'INR', 'KRW', 'CHF', 'SGD', 'MXN', 'BRL'];
        grid.innerHTML = popular.map(code => `
            <div class="rate-card" data-code="${code}">
                <div class="rate-card-top">
                    <span class="rate-flag">${CURRENCIES[code].flag} ${CURRENCIES[code].name}</span>
                    <span class="rate-code">${code}</span>
                </div>
                <div class="rate-value">${CURRENCIES[code].symbol}${CURRENCIES[code].rate.toFixed(4)}</div>
            </div>
        `).join('');

        grid.querySelectorAll('.rate-card').forEach(card => {
            card.addEventListener('click', () => {
                document.getElementById('currencyTo').value = card.dataset.code;
                this.convert();
            });
        });
    },

    savePreset() {
        const preset = {
            id: Date.now(),
            from: state.currency.from,
            to: state.currency.to,
            amount: state.currency.amount,
            name: `${state.currency.amount} ${state.currency.from} → ${state.currency.to}`
        };
        state.currency.presets.unshift(preset);
        if (state.currency.presets.length > 20) state.currency.presets.pop();
        Storage.save('currencyPresets', state.currency.presets);
        this.renderPresets();
        showToast('Preset saved', 'success', 1500);
    },

    renderPresets() {
        const list = document.getElementById('currencyPresets');
        if (state.currency.presets.length === 0) {
            list.innerHTML = '<div class="presets-empty">No presets yet. Save your favorite conversions!</div>';
            return;
        }
        list.innerHTML = state.currency.presets.map(p => `
            <div class="preset-chip" data-id="${p.id}">
                <span>${CURRENCIES[p.from].flag} ${p.name}</span>
                <button class="remove-preset" data-id="${p.id}">×</button>
            </div>
        `).join('');

        list.querySelectorAll('.preset-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-preset')) return;
                const id = parseInt(chip.dataset.id);
                const preset = state.currency.presets.find(p => p.id === id);
                if (preset) {
                    document.getElementById('currencyFrom').value = preset.from;
                    document.getElementById('currencyTo').value = preset.to;
                    document.getElementById('currencyFromAmount').value = preset.amount;
                    this.convert();
                }
            });
        });

        list.querySelectorAll('.remove-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                state.currency.presets = state.currency.presets.filter(p => p.id !== id);
                Storage.save('currencyPresets', state.currency.presets);
                this.renderPresets();
                showToast('Preset removed', 'info', 1200);
            });
        });
    },

    async fetchLiveRates() {
        document.getElementById('rateStatus').textContent = 'Fetching...';
        try {
            const res = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await res.json();
            if (data.rates) {
                state.currency.rates = {};
                Object.entries(data.rates).forEach(([code, rate]) => {
                    if (CURRENCIES[code]) {
                        state.currency.rates[code] = { ...CURRENCIES[code], rate };
                    }
                });
                state.currency.lastUpdate = new Date();
                document.getElementById('rateStatus').textContent = 'Live';
                document.getElementById('rateStatus').style.color = 'var(--accent-success)';
                this.convert();
                this.renderRates();
                showToast('Live rates updated', 'success', 2000);
            }
        } catch (e) {
            document.getElementById('rateStatus').textContent = 'Offline';
            document.getElementById('rateStatus').style.color = 'var(--accent-warning)';
            showToast('Using static rates (offline)', 'warning', 2000);
        }
    },

    bindEvents() {
        document.getElementById('currencyFromAmount').addEventListener('input', () => this.convert());
        document.getElementById('currencyToAmount').addEventListener('input', () => this.convertReverse());
        document.getElementById('currencyFrom').addEventListener('change', () => this.convert());
        document.getElementById('currencyTo').addEventListener('change', () => this.convert());
        document.getElementById('currencySwap').addEventListener('click', () => this.swap());
        document.getElementById('saveCurrencyPreset').addEventListener('click', () => this.savePreset());
        document.getElementById('refreshRatesBtn').addEventListener('click', () => this.fetchLiveRates());

        document.querySelectorAll('#currency-mode .quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('currencyFromAmount').value = btn.dataset.amount;
                this.convert();
            });
        });
    }
};

// ===== METRIC CONVERTER =====
const Metric = {
    init() {
        this.renderCategoryTabs();
        this.populateUnits();
        this.renderPresets();
        this.convert();
        this.bindEvents();
    },

    renderCategoryTabs() {
        const tabs = document.getElementById('categoryTabs');
        tabs.innerHTML = Object.entries(METRIC_CATEGORIES).map(([key, cat]) => `
            <button class="category-tab ${key === state.metric.category ? 'active' : ''}" data-category="${key}">
                <span>${cat.icon}</span>
                <span>${cat.name}</span>
            </button>
        `).join('');

        tabs.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                state.metric.category = tab.dataset.category;
                this.populateUnits();
                this.convert();
            });
        });
    },

    populateUnits() {
        const category = METRIC_CATEGORIES[state.metric.category];
        const units = Object.entries(category.units);
        const options = units.map(([key, unit]) =>
            `<option value="${key}">${unit.name} (${key})</option>`
        ).join('');

        const fromSel = document.getElementById('metricFrom');
        const toSel = document.getElementById('metricTo');
        fromSel.innerHTML = options;
        toSel.innerHTML = options;

        // Set defaults per category
        const defaults = {
            length: ['m', 'ft'],
            weight: ['kg', 'lb'],
            temperature: ['C', 'F'],
            volume: ['l', 'gal_us'],
            area: ['m2', 'ft2'],
            speed: ['kmh', 'mph'],
            time: ['h', 'min'],
            energy: ['J', 'cal'],
            pressure: ['Pa', 'psi'],
            data: ['MB', 'GB'],
            angle: ['deg', 'rad'],
            frequency: ['Hz', 'kHz'],
            power: ['W', 'hp'],
            fuel: ['mpg_us', 'l_100km'],
            cooking: ['cup', 'ml']
        };
        const [defFrom, defTo] = defaults[state.metric.category] || [units[0][0], units[1]?.[0] || units[0][0]];
        fromSel.value = defFrom;
        toSel.value = defTo;
        state.metric.from = defFrom;
        state.metric.to = defTo;
    },

    convertTemperature(value, from, to) {
        let celsius;
        switch (from) {
            case 'C': celsius = value; break;
            case 'F': celsius = (value - 32) * 5/9; break;
            case 'K': celsius = value - 273.15; break;
            case 'R': celsius = (value - 491.67) * 5/9; break;
            case 'Re': celsius = value * 1.25; break;
        }
        switch (to) {
            case 'C': return celsius;
            case 'F': return celsius * 9/5 + 32;
            case 'K': return celsius + 273.15;
            case 'R': return (celsius + 273.15) * 9/5;
            case 'Re': return celsius * 0.8;
        }
    },

    convertFuel(value, from, to) {
        if (from === to) return value;
        // Convert all to L/100km first
        let l100km;
        switch (from) {
            case 'mpg_us': l100km = 235.215 / value; break;
            case 'mpg_uk': l100km = 282.481 / value; break;
            case 'km_l': l100km = 100 / value; break;
            case 'l_100km': l100km = value; break;
        }
        switch (to) {
            case 'mpg_us': return 235.215 / l100km;
            case 'mpg_uk': return 282.481 / l100km;
            case 'km_l': return 100 / l100km;
            case 'l_100km': return l100km;
        }
    },

    convert() {
        const amount = parseFloat(document.getElementById('metricFromAmount').value) || 0;
        const from = document.getElementById('metricFrom').value;
        const to = document.getElementById('metricTo').value;
        const category = METRIC_CATEGORIES[state.metric.category];

        let result;
        if (state.metric.category === 'temperature') {
            result = this.convertTemperature(amount, from, to);
        } else if (state.metric.category === 'fuel') {
            result = this.convertFuel(amount, from, to);
        } else {
            const fromFactor = category.units[from].factor;
            const toFactor = category.units[to].factor;
            result = (amount * fromFactor) / toFactor;
        }

        document.getElementById('metricToAmount').value = result.toFixed(state.settings.decimalPlaces);

        const formula = document.getElementById('conversionFormula');
        formula.innerHTML = `
            <strong>${amount} ${category.units[from].name}</strong> =
            <strong>${result.toFixed(state.settings.decimalPlaces)} ${category.units[to].name}</strong>
        `;

        state.metric.from = from;
        state.metric.to = to;
        state.metric.amount = amount;

        this.renderAllConversions(amount, from);
    },

    convertReverse() {
        const amount = parseFloat(document.getElementById('metricToAmount').value) || 0;
        const from = document.getElementById('metricFrom').value;
        const to = document.getElementById('metricTo').value;
        const category = METRIC_CATEGORIES[state.metric.category];

        let result;
        if (state.metric.category === 'temperature') {
            result = this.convertTemperature(amount, to, from);
        } else if (state.metric.category === 'fuel') {
            result = this.convertFuel(amount, to, from);
        } else {
            const fromFactor = category.units[from].factor;
            const toFactor = category.units[to].factor;
            result = (amount * toFactor) / fromFactor;
        }

        document.getElementById('metricFromAmount').value = result.toFixed(state.settings.decimalPlaces);
        this.convert();
    },

    swap() {
        const fromSel = document.getElementById('metricFrom');
        const toSel = document.getElementById('metricTo');
        [fromSel.value, toSel.value] = [toSel.value, fromSel.value];
        this.convert();
    },

    renderAllConversions(amount, from) {
        const grid = document.getElementById('conversionsGrid');
        const category = METRIC_CATEGORIES[state.metric.category];
        const units = Object.entries(category.units).filter(([k]) => k !== from);

        grid.innerHTML = units.map(([key, unit]) => {
            let result;
            if (state.metric.category === 'temperature') {
                result = this.convertTemperature(amount, from, key);
            } else if (state.metric.category === 'fuel') {
                result = this.convertFuel(amount, from, key);
            } else {
                const fromFactor = category.units[from].factor;
                const toFactor = unit.factor;
                result = (amount * fromFactor) / toFactor;
            }
            return `
                <div class="conversion-card" data-unit="${key}">
                    <div class="conversion-card-top">
                        <span class="unit-name">${unit.name}</span>
                        <span class="rate-code">${key}</span>
                    </div>
                    <div class="conversion-value">${this.formatResult(result)}</div>
                </div>
            `;
        }).join('');

        grid.querySelectorAll('.conversion-card').forEach(card => {
            card.addEventListener('click', () => {
                document.getElementById('metricTo').value = card.dataset.unit;
                this.convert();
            });
        });
    },

    formatResult(num) {
        if (!isFinite(num)) return '∞';
        const abs = Math.abs(num);
        if (abs !== 0 && (abs < 1e-4 || abs >= 1e10)) {
            return num.toExponential(3);
        }
        return parseFloat(num.toPrecision(8)).toLocaleString(undefined, {
            maximumFractionDigits: state.settings.decimalPlaces
        });
    },

    savePreset() {
        const preset = {
            id: Date.now(),
            category: state.metric.category,
            from: state.metric.from,
            to: state.metric.to,
            amount: state.metric.amount,
            name: `${state.metric.amount} ${state.metric.from} → ${state.metric.to}`
        };
        state.metric.presets.unshift(preset);
        if (state.metric.presets.length > 20) state.metric.presets.pop();
        Storage.save('metricPresets', state.metric.presets);
        this.renderPresets();
        showToast('Preset saved', 'success', 1500);
    },

    renderPresets() {
        const list = document.getElementById('metricPresets');
        if (state.metric.presets.length === 0) {
            list.innerHTML = '<div class="presets-empty">No presets yet. Save your favorite conversions!</div>';
            return;
        }
        list.innerHTML = state.metric.presets.map(p => `
            <div class="preset-chip" data-id="${p.id}">
                <span>${METRIC_CATEGORIES[p.category].icon} ${p.name}</span>
                <button class="remove-preset" data-id="${p.id}">×</button>
            </div>
        `).join('');

        list.querySelectorAll('.preset-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-preset')) return;
                const id = parseInt(chip.dataset.id);
                const preset = state.metric.presets.find(p => p.id === id);
                if (preset) {
                    state.metric.category = preset.category;
                    this.renderCategoryTabs();
                    this.populateUnits();
                    document.getElementById('metricFrom').value = preset.from;
                    document.getElementById('metricTo').value = preset.to;
                    document.getElementById('metricFromAmount').value = preset.amount;
                    this.convert();
                }
            });
        });

        list.querySelectorAll('.remove-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                state.metric.presets = state.metric.presets.filter(p => p.id !== id);
                Storage.save('metricPresets', state.metric.presets);
                this.renderPresets();
                showToast('Preset removed', 'info', 1200);
            });
        });
    },

    bindEvents() {
        document.getElementById('metricFromAmount').addEventListener('input', () => this.convert());
        document.getElementById('metricToAmount').addEventListener('input', () => this.convertReverse());
        document.getElementById('metricFrom').addEventListener('change', () => this.convert());
        document.getElementById('metricTo').addEventListener('change', () => this.convert());
        document.getElementById('metricSwap').addEventListener('click', () => this.swap());
        document.getElementById('saveMetricPreset').addEventListener('click', () => this.savePreset());
    }
};

// ===== AI ASSISTANT =====
const AI = {
    init() {
        this.bindEvents();
    },

    bindEvents() {
        const input = document.getElementById('aiInput');
        const send = document.getElementById('aiSend');

        send.addEventListener('click', () => this.processQuery(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processQuery(input.value);
        });

        document.querySelectorAll('.suggestion-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                input.value = chip.dataset.query;
                this.processQuery(chip.dataset.query);
            });
        });

        document.getElementById('aiVoiceBtn').addEventListener('click', () => {
            Voice.start((transcript) => {
                input.value = transcript;
                this.processQuery(transcript);
            });
        });
    },

    addMessage(role, content, result = null) {
        const chat = document.getElementById('aiChat');
        const msg = document.createElement('div');
        msg.className = `ai-message ai-${role}`;

        const avatar = role === 'user' ? 'You' : 'AI';
        let bubble = `<div class="ai-avatar">${avatar}</div><div class="ai-bubble">${content}`;
        if (result !== null) bubble += `<div class="ai-result">${result}</div>`;
        bubble += '</div>';

        msg.innerHTML = bubble;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    showTyping() {
        const chat = document.getElementById('aiChat');
        const msg = document.createElement('div');
        msg.className = 'ai-message ai-bot';
        msg.id = 'aiTyping';
        msg.innerHTML = `<div class="ai-avatar">AI</div><div class="ai-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    },

    hideTyping() {
        const typing = document.getElementById('aiTyping');
        if (typing) typing.remove();
    },

    async processQuery(query) {
        if (!query.trim()) return;
        document.getElementById('aiInput').value = '';
        this.addMessage('user', query);
        this.showTyping();

        await new Promise(r => setTimeout(r, 600));
        this.hideTyping();

        const response = this.analyze(query);
        this.addMessage('bot', response.message, response.result);
    },

    analyze(query) {
        const q = query.toLowerCase().trim();

        // Percentage
        const pctMatch = q.match(/(\d+\.?\d*)\s*(?:%|percent)\s*of\s*(\d+\.?\d*)/);
        if (pctMatch) {
            const pct = parseFloat(pctMatch[1]);
            const num = parseFloat(pctMatch[2]);
            const result = (pct / 100) * num;
            return {
                message: `${pct}% of ${num} is calculated as <em>(${pct} ÷ 100) × ${num}</em>`,
                result: result.toLocaleString()
            };
        }

        // Tip calculation
        const tipMatch = q.match(/tip.*?(\d+\.?\d*).*?(?:at|@)\s*(\d+\.?\d*)\s*%?/);
        if (tipMatch) {
            const bill = parseFloat(tipMatch[1]);
            const tipPct = parseFloat(tipMatch[2]);
            const tip = bill * tipPct / 100;
            const total = bill + tip;
            return {
                message: `For a $${bill} bill at ${tipPct}% tip:`,
                result: `Tip: $${tip.toFixed(2)} | Total: $${total.toFixed(2)}`
            };
        }

        // Currency conversion
        const curMatch = q.match(/convert\s+(\d+\.?\d*)\s+(\w+)\s+(?:to|in|into)\s+(\w+)/i);
        if (curMatch) {
            const amount = parseFloat(curMatch[1]);
            const from = this.matchCurrency(curMatch[2]);
            const to = this.matchCurrency(curMatch[3]);
            if (from && to) {
                const usdAmount = amount / CURRENCIES[from].rate;
                const result = usdAmount * CURRENCIES[to].rate;
                return {
                    message: `Converting ${amount} ${CURRENCIES[from].name} to ${CURRENCIES[to].name}`,
                    result: `${CURRENCIES[from].symbol}${amount.toLocaleString()} = ${CURRENCIES[to].symbol}${result.toLocaleString(undefined, {maximumFractionDigits: 4})}`
                };
            }
        }

        // Unit conversion
        const unitMatch = q.match(/(?:how\s+many\s+|convert\s+)?(\d+\.?\d*)\s+(\w+(?:\s?\w+)?)\s+(?:to|in|into|=)\s+(\w+(?:\s?\w+)?)/i);
        if (unitMatch) {
            const amount = parseFloat(unitMatch[1]);
            const fromStr = unitMatch[2].trim();
            const toStr = unitMatch[3].trim();
            const conv = this.tryUnitConversion(amount, fromStr, toStr);
            if (conv) return conv;
        }

        // Average/mean
        const avgMatch = q.match(/(?:average|mean)\s+of\s+([\d,.\s]+)/i);
        if (avgMatch) {
            const nums = avgMatch[1].split(/[,\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
            const avg = nums.reduce((a,b) => a+b, 0) / nums.length;
            return {
                message: `Average of ${nums.join(', ')}`,
                result: `${avg.toFixed(4)} (sum: ${nums.reduce((a,b)=>a+b,0)}, count: ${nums.length})`
            };
        }

        // Sum
        const sumMatch = q.match(/(?:sum|total|add)\s+(?:of\s+)?([\d,.\s+]+)/i);
        if (sumMatch) {
            const nums = sumMatch[1].split(/[,\s+]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
            const sum = nums.reduce((a,b) => a+b, 0);
            return {
                message: `Sum of ${nums.join(' + ')}`,
                result: sum.toLocaleString()
            };
        }

        // Square root
        const sqrtMatch = q.match(/(?:square\s+root|sqrt|√)\s*(?:of\s+)?(\d+\.?\d*)/);
        if (sqrtMatch) {
            const n = parseFloat(sqrtMatch[1]);
            return {
                message: `Square root of ${n}`,
                result: Math.sqrt(n).toLocaleString()
            };
        }

        // Area of circle
        const circleMatch = q.match(/(?:area\s+of\s+)?circle.*?radius\s*(?:of\s+)?(\d+\.?\d*)/i);
        if (circleMatch) {
            const r = parseFloat(circleMatch[1]);
            const area = Math.PI * r * r;
            const circ = 2 * Math.PI * r;
            return {
                message: `Circle with radius ${r}:<br><em>Area = π × r² = π × ${r}²</em>`,
                result: `Area: ${area.toFixed(4)} | Circumference: ${circ.toFixed(4)}`
            };
        }

        // Area of rectangle
        const rectMatch = q.match(/area.*?rectangle.*?(\d+\.?\d*).*?(?:by|x|×)\s*(\d+\.?\d*)/i);
        if (rectMatch) {
            const w = parseFloat(rectMatch[1]);
            const h = parseFloat(rectMatch[2]);
            return {
                message: `Rectangle area ${w} × ${h}`,
                result: `Area: ${(w*h).toLocaleString()} | Perimeter: ${(2*(w+h))}`
            };
        }

        // Explanations
        if (q.includes('explain') || q.includes('what is')) {
            return this.getExplanation(q);
        }

        // Factorial
        const factMatch = q.match(/(?:factorial\s+of\s+|(\d+)\s*!)/);
        if (factMatch) {
            const n = parseInt(factMatch[1] || q.match(/\d+/)[0]);
            return {
                message: `${n}! = ${n} × ${n-1} × ... × 1`,
                result: Calculator.factorial(n).toLocaleString()
            };
        }

        // Try direct math evaluation
        try {
            const mathQ = q
                .replace(/plus|add|and/g, '+')
                .replace(/minus|subtract|less/g, '-')
                .replace(/times|multiplied\s+by|x/gi, '*')
                .replace(/divided\s+by|over/g, '/')
                .replace(/to\s+the\s+power\s+of|\^/g, '**')
                .replace(/[^\d+\-*/.()%\s]/g, ' ')
                .replace(/\s+/g, '')
                .trim();

            if (mathQ && /^[\d+\-*/.()%]+$/.test(mathQ)) {
                const result = Function('"use strict"; return (' + mathQ + ')')();
                if (!isNaN(result)) {
                    return {
                        message: `Calculating <em>${mathQ}</em>`,
                        result: result.toLocaleString()
                    };
                }
            }
        } catch (e) {}

        return {
            message: `I'm not sure how to answer that. Try one of these:<br>
                <ul>
                    <li>"what is 15% of 200"</li>
                    <li>"convert 100 USD to EUR"</li>
                    <li>"how many km in 10 miles"</li>
                    <li>"average of 10, 20, 30"</li>
                    <li>"area of circle radius 5"</li>
                </ul>`,
            result: null
        };
    },

    matchCurrency(str) {
        const s = str.toUpperCase();
        if (CURRENCIES[s]) return s;
        const map = {
            DOLLARS: 'USD', DOLLAR: 'USD', USD: 'USD',
            EUROS: 'EUR', EURO: 'EUR', EUR: 'EUR',
            POUNDS: 'GBP', POUND: 'GBP', STERLING: 'GBP',
            YEN: 'JPY', YUAN: 'CNY', RMB: 'CNY',
            RUPEES: 'INR', RUPEE: 'INR',
            WON: 'KRW', BITCOIN: 'BTC', BTC: 'BTC',
            ETHEREUM: 'ETH', ETH: 'ETH',
            FRANCS: 'CHF', FRANC: 'CHF',
            RUBLES: 'RUB', RUBLE: 'RUB',
            PESOS: 'MXN', PESO: 'MXN',
            REAL: 'BRL', REAIS: 'BRL',
            RAND: 'ZAR', NAIRA: 'NGN',
            SHEKEL: 'ILS', SHEKELS: 'ILS',
            LIRA: 'TRY', RIYAL: 'SAR',
            DIRHAM: 'AED', BAHT: 'THB',
            RINGGIT: 'MYR', RUPIAH: 'IDR',
            DONG: 'VND', GOLD: 'XAU', SILVER: 'XAG'
        };
        return map[s] || null;
    },

    tryUnitConversion(amount, fromStr, toStr) {
        for (const [catKey, cat] of Object.entries(METRIC_CATEGORIES)) {
            const fromKey = this.matchUnit(fromStr, cat.units);
            const toKey = this.matchUnit(toStr, cat.units);
            if (fromKey && toKey) {
                let result;
                if (catKey === 'temperature') {
                    result = Metric.convertTemperature(amount, fromKey, toKey);
                } else if (catKey === 'fuel') {
                    result = Metric.convertFuel(amount, fromKey, toKey);
                } else {
                    result = (amount * cat.units[fromKey].factor) / cat.units[toKey].factor;
                }
                return {
                    message: `Converting ${amount} ${cat.units[fromKey].name} to ${cat.units[toKey].name}`,
                    result: `${amount} ${fromKey} = ${result.toLocaleString(undefined, {maximumFractionDigits: 6})} ${toKey}`
                };
            }
        }
        return null;
    },

    matchUnit(str, units) {
        const s = str.toLowerCase().replace(/s$/, '');
        for (const [key, unit] of Object.entries(units)) {
            if (key.toLowerCase() === s) return key;
            if (unit.name.toLowerCase() === s) return key;
            if (unit.name.toLowerCase().replace(/s$/, '') === s) return key;
        }
        const aliases = {
            meters: 'm', meter: 'm', metres: 'm', metre: 'm',
            feet: 'ft', foot: 'ft',
            inches: 'in', inch: 'in',
            miles: 'mi', mile: 'mi',
            kilograms: 'kg', kilogram: 'kg', kilos: 'kg', kilo: 'kg',
            pounds: 'lb', pound: 'lb', lbs: 'lb',
            ounces: 'oz', ounce: 'oz',
            celsius: 'C', fahrenheit: 'F', kelvin: 'K',
            liters: 'l', liter: 'l', litres: 'l', litre: 'l',
            gallons: 'gal_us', gallon: 'gal_us',
            kilometers: 'km', kilometer: 'km',
            seconds: 's', second: 's', minutes: 'min', minute: 'min',
            hours: 'h', hour: 'h', days: 'd', day: 'd',
            megabytes: 'MB', gigabytes: 'GB', kilobytes: 'KB'
        };
        if (aliases[s]) return aliases[s];
        return null;
    },

    getExplanation(q) {
        const topics = {
            'quadratic': 'The <em>quadratic formula</em> solves ax² + bx + c = 0:<br>x = (-b ± √(b² - 4ac)) / 2a',
            'pythagorean': 'The <em>Pythagorean theorem</em>: in a right triangle, a² + b² = c², where c is the hypotenuse.',
            'pi': 'π (pi) ≈ 3.14159... is the ratio of a circle\'s circumference to its diameter.',
            'euler': 'Euler\'s number e ≈ 2.71828... is the base of natural logarithms.',
            'prime': 'A <em>prime number</em> is a natural number > 1 divisible only by 1 and itself.',
            'factorial': 'n! (factorial) is the product of all positive integers ≤ n. Example: 5! = 120',
            'logarithm': 'A <em>logarithm</em> is the inverse of exponentiation. log(x) asks: what power of 10 gives x?',
            'derivative': 'A <em>derivative</em> measures the instantaneous rate of change of a function.',
            'integral': 'An <em>integral</em> represents the accumulation (area under a curve) of a function.'
        };
        for (const [key, val] of Object.entries(topics)) {
            if (q.includes(key)) return { message: val, result: null };
        }
        return { message: 'I can explain: quadratic formula, Pythagorean theorem, pi, euler, prime numbers, factorial, logarithm, derivative, integral', result: null };
    }
};

// ===== VOICE COMMANDS =====
const Voice = {
    recognition: null,
    callback: null,

    init() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            console.warn('Speech recognition not supported');
            return false;
        }
        this.recognition = new SR();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = state.settings.voiceLang;

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(r => r[0].transcript)
                .join('');
            document.getElementById('voiceTranscript').textContent = transcript;

            if (event.results[event.results.length - 1].isFinal) {
                this.stop();
                if (this.callback) {
                    this.callback(transcript);
                } else {
                    this.handleCommand(transcript);
                }
            }
        };

        this.recognition.onerror = (e) => {
            console.warn('Voice error:', e);
            this.stop();
            showToast('Voice recognition error: ' + e.error, 'error');
        };

        this.recognition.onend = () => {
            this.stop();
        };

        return true;
    },

    start(callback = null) {
        if (!this.recognition && !this.init()) {
            showToast('Voice not supported in this browser', 'error');
            return;
        }
        this.callback = callback;
        this.recognition.lang = state.settings.voiceLang;
        document.getElementById('voiceOverlay').classList.add('active');
        document.getElementById('voiceTranscript').textContent = 'Listening...';
        document.getElementById('voiceBtn').classList.add('listening');
        try {
            this.recognition.start();
        } catch (e) {
            console.warn(e);
        }
    },

    stop() {
        try {
            this.recognition && this.recognition.stop();
        } catch (e) {}
        document.getElementById('voiceOverlay').classList.remove('active');
        document.getElementById('voiceBtn').classList.remove('listening');
    },

    handleCommand(transcript) {
        const t = transcript.toLowerCase();

        // Mode switches
        if (t.includes('calculator') || t.includes('calculate')) {
            if (!t.match(/\d/)) {
                switchMode('calculator');
                showToast('Switched to Calculator', 'success');
                return;
            }
        }
        if (t.includes('currency') || t.includes('exchange')) {
            if (!t.match(/\d/)) {
                switchMode('currency');
                return;
            }
        }
        if (t.includes('convert') && t.match(/\d/)) {
            // Go to AI for any conversion
            switchMode('ai');
            document.getElementById('aiInput').value = transcript;
            AI.processQuery(transcript);
            return;
        }
        if (t.includes('metric') || t.includes('unit')) {
            if (!t.match(/\d/)) {
                switchMode('metric');
                return;
            }
        }

        // Clear
        if (t === 'clear' || t.includes('clear screen')) {
            Calculator.handleAction('clear');
            showToast('Cleared', 'info');
            return;
        }

        // Math calculation via AI
        switchMode('ai');
        document.getElementById('aiInput').value = transcript;
        AI.processQuery(transcript);
    }
};

// ===== THEMES =====
const Themes = {
    init() {
        const saved = Storage.load('theme', 'dark');
        this.apply(saved);
        state.settings.theme = saved;

        document.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.apply(theme);
                document.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                Storage.save('theme', theme);
                state.settings.theme = theme;
                showToast(`Theme: ${theme}`, 'info', 1500);
            });
        });

        // Custom theme
        document.getElementById('applyCustomTheme').addEventListener('click', () => {
            const p = document.getElementById('customPrimary').value;
            const s = document.getElementById('customSecondary').value;
            const b = document.getElementById('customBg').value;
            document.documentElement.style.setProperty('--accent-primary', p);
            document.documentElement.style.setProperty('--accent-secondary', s);
            document.documentElement.style.setProperty('--bg-primary', b);
            Storage.save('customTheme', { p, s, b });
            showToast('Custom theme applied', 'success');
        });

        // Load custom theme if exists
        const custom = Storage.load('customTheme');
        if (custom && saved === 'custom') {
            document.documentElement.style.setProperty('--accent-primary', custom.p);
            document.documentElement.style.setProperty('--accent-secondary', custom.s);
            document.documentElement.style.setProperty('--bg-primary', custom.b);
        }
    },

    apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.querySelectorAll('.theme-option').forEach(b => {
            b.classList.toggle('active', b.dataset.theme === theme);
        });
    }
};

// ===== MODE SWITCHING =====
function switchMode(mode) {
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.mode-tab[data-mode="${mode}"]`).classList.add('active');

    document.querySelectorAll('.mode-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${mode}-mode`).classList.add('active');
}

// ===== KEYBOARD SUPPORT =====
function initKeyboard() {
    document.addEventListener('keydown', (e) => {
        // Don't capture when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

        // Voice shortcut
        if (e.ctrlKey && e.code === 'Space') {
            e.preventDefault();
            Voice.start();
            return;
        }

        // Only process for calculator mode
        if (!document.getElementById('calculator-mode').classList.contains('active')) return;

        const key = e.key;
        if (/^[0-9]$/.test(key)) {
            Calculator.handleAction('number', key);
            animateButton(`[data-action="number"][data-value="${key}"]`);
        } else if (key === '.') {
            Calculator.handleAction('decimal');
            animateButton('[data-action="decimal"]');
        } else if (['+', '-', '*', '/'].includes(key)) {
            Calculator.handleAction('operator', key);
            animateButton(`[data-action="operator"][data-value="${key}"]`);
        } else if (key === 'Enter' || key === '=') {
            e.preventDefault();
            Calculator.handleAction('equals');
            animateButton('[data-action="equals"]');
        } else if (key === 'Backspace') {
            Calculator.handleAction('backspace');
            animateButton('[data-action="backspace"]');
        } else if (key === 'Escape') {
            Calculator.handleAction('clear');
            animateButton('[data-action="clear"]');
        } else if (key === '%') {
            Calculator.handleAction('percent');
        }
    });
}

function animateButton(selector) {
    const btn = document.querySelector(`#${state.calculator.mode}-calc ${selector}, .standard-calc.active ${selector}, .scientific-calc.active ${selector}`);
    if (btn) {
        btn.classList.add('pressed');
        setTimeout(() => btn.classList.remove('pressed'), 200);
    }
}

// ===== INITIALIZATION =====
function init() {
    // Load saved state
    state.calculator.history = Storage.load('history', []);
    state.currency.presets = Storage.load('currencyPresets', []);
    state.metric.presets = Storage.load('metricPresets', []);
    const savedSettings = Storage.load('settings');
    if (savedSettings) Object.assign(state.settings, savedSettings);

    // Apply settings to UI
    document.getElementById('soundToggle').checked = state.settings.sound;
    document.getElementById('hapticToggle').checked = state.settings.haptic;
    document.getElementById('animToggle').checked = state.settings.animations;
    document.getElementById('liveRatesToggle').checked = state.settings.liveRates;
    document.getElementById('decimalPlaces').value = state.settings.decimalPlaces;
    document.getElementById('voiceLang').value = state.settings.voiceLang;

    if (!state.settings.animations) document.body.classList.add('no-anim');

    // Init modules
    Themes.init();
    Currency.init();
    Metric.init();
    AI.init();
    Voice.init();
    Calculator.renderHistory();
    Calculator.updateDisplay();
    initKeyboard();

    // Mode tabs
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });

    // Calc buttons
    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            const value = btn.dataset.value;
            Calculator.handleAction(action, value);
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 200);
        });
    });

    // Calc mode toggle
    document.querySelectorAll('.toggle-btn[data-calc-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toggle-btn[data-calc-mode]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.calculator.mode = btn.dataset.calcMode;
            document.querySelectorAll('.calc-buttons').forEach(c => c.classList.remove('active'));
            document.getElementById(`${state.calculator.mode}-calc`).classList.add('active');
            Calculator.updateDisplay();
        });
    });

    // Prog base
    document.querySelectorAll('.prog-base').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.prog-base').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.calculator.programmerBase = parseInt(btn.dataset.base);

            // Enable/disable hex buttons
            document.querySelectorAll('.hex-btn').forEach(b => {
                b.disabled = state.calculator.programmerBase !== 16;
            });
        });
    });

    // Header buttons
    document.getElementById('voiceBtn').addEventListener('click', () => Voice.start());
    document.getElementById('historyBtn').addEventListener('click', () => {
        document.getElementById('historyPanel').classList.toggle('hidden');
    });
    document.getElementById('themeBtn').addEventListener('click', () => {
        document.getElementById('themePanel').classList.toggle('open');
        document.getElementById('settingsPanel').classList.remove('open');
    });
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsPanel').classList.toggle('open');
        document.getElementById('themePanel').classList.remove('open');
    });
    document.getElementById('closeThemePanel').addEventListener('click', () => {
        document.getElementById('themePanel').classList.remove('open');
    });
    document.getElementById('closeSettingsPanel').addEventListener('click', () => {
        document.getElementById('settingsPanel').classList.remove('open');
    });
    document.getElementById('clearHistoryBtn').addEventListener('click', () => Calculator.clearHistory());
    document.getElementById('cancelVoice').addEventListener('click', () => Voice.stop());

    // Settings
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        state.settings.sound = e.target.checked;
        Storage.save('settings', state.settings);
    });
    document.getElementById('hapticToggle').addEventListener('change', (e) => {
        state.settings.haptic = e.target.checked;
        Storage.save('settings', state.settings);
    });
    document.getElementById('animToggle').addEventListener('change', (e) => {
        state.settings.animations = e.target.checked;
        document.body.classList.toggle('no-anim', !e.target.checked);
        Storage.save('settings', state.settings);
    });
    document.getElementById('liveRatesToggle').addEventListener('change', (e) => {
        state.settings.liveRates = e.target.checked;
        Storage.save('settings', state.settings);
        if (e.target.checked) Currency.fetchLiveRates();
    });
    document.getElementById('decimalPlaces').addEventListener('change', (e) => {
        state.settings.decimalPlaces = parseInt(e.target.value);
        Storage.save('settings', state.settings);
        Currency.convert();
        Metric.convert();
    });
    document.getElementById('voiceLang').addEventListener('change', (e) => {
        state.settings.voiceLang = e.target.value;
        Storage.save('settings', state.settings);
    });

    document.getElementById('resetAllBtn').addEventListener('click', () => {
        if (confirm('Reset all settings, history, and presets? This cannot be undone.')) {
            Storage.clearAll();
            location.reload();
        }
    });

    // Open About section from footer
    const openAboutBtn = document.getElementById('openAboutBtn');
    if (openAboutBtn) {
        openAboutBtn.addEventListener('click', () => {
            document.getElementById('settingsPanel').classList.add('open');
            document.getElementById('themePanel').classList.remove('open');
            setTimeout(() => {
                const aboutSection = document.querySelector('.about-section');
                if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 350);
        });
    }

    // Close panels on outside click
    document.addEventListener('click', (e) => {
        const themePanel = document.getElementById('themePanel');
        const settingsPanel = document.getElementById('settingsPanel');
        if (themePanel.classList.contains('open') &&
            !themePanel.contains(e.target) &&
            !document.getElementById('themeBtn').contains(e.target)) {
            themePanel.classList.remove('open');
        }
        if (settingsPanel.classList.contains('open') &&
            !settingsPanel.contains(e.target) &&
            !document.getElementById('settingsBtn').contains(e.target)) {
            settingsPanel.classList.remove('open');
        }
    });

    // Welcome toast
    setTimeout(() => {
        showToast('Welcome to Nexus Calculator! Press Ctrl+Space for voice.', 'info', 4000);
    }, 500);
}

// Start the app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
