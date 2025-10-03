# BeğonTech - Akıllı Ev Simülasyonu

Bu proje BeğonTech web sitesi için geliştirilmiş etkileşimli akıllı ev simülasyonu içermektedir.

## 🏠 Özellikler

### React Bileşeni (`SmartHomeSim.js`)
- Modern React hooks kullanımı (useState)
- Tailwind CSS ile responsive tasarım
- Etkileşimli hotspot'lar
- Modal kontrol panelleri
- Hazır senaryolar (Eve Geldim, Evden Çıktım, Gece Modu)

### Vanilla JS Versiyonu (`assets/js/smart-home-sim.js`)
- Mevcut HTML projesine kolay entegrasyon
- Sınıf tabanlı yapı
- Event-driven architecture
- Dinamik DOM manipülasyonu

## 🎮 Kullanım

### HTML Projesine Entegrasyon
1. CSS ve JS dosyalarını dahil edin
2. Container div'i ekleyin: `<div id="smartHomeContainer"></div>`
3. JavaScript ile başlatın: `smartHome = new SmartHomeSim('smartHomeContainer');`

### React Projesine Entegrasyon
```jsx
import SmartHomeSim from './SmartHomeSim';

function App() {
    return (
        <div>
            <SmartHomeSim />
        </div>
    );
}
```

## 🏗️ Dosya Yapısı

```
site/
├── SmartHomeSim.js                    # React bileşeni
├── index.html                         # Ana HTML dosyası (entegre edilmiş)
└── assets/
    ├── css/
    │   └── styles.css                 # Hotspot stilleri dahil
    ├── js/
    │   ├── main.js                    # Ana JavaScript
    │   └── smart-home-sim.js          # Akıllı ev simülasyonu
    └── images/
        └── smart-home/                # Ev planı görselleri için
```

## 🎨 Özelleştirme

### Yeni Oda Ekleme
1. `devices` state'ine yeni oda ekleyin
2. `roomConfigs`'e oda yapılandırması ekleyin
3. HTML'e yeni hotspot ekleyin
4. Pozisyonu ayarlayın

### Yeni Cihaz Ekleme
1. Oda state'ine cihaz ekleyin
2. Room config'e kontrol türü ekleyin
3. Gerekirse yeni kontrol türü oluşturun

### Yeni Senaryo Ekleme
1. `executeScenario` fonksiyonuna yeni case ekleyin
2. HTML'e senaryo butonu ekleyin
3. Renk ve ikon belirleyin

## 🔌 API Entegrasyonu

### REST API Örneği
```javascript
async updateDevice(room, device, value) {
    try {
        const response = await fetch('/api/devices', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ room, device, value })
        });
        if (response.ok) {
            this.devices[room][device] = value;
            this.updateStatusIndicators();
        }
    } catch (error) {
        console.error('Cihaz güncelleme hatası:', error);
    }
}
```

### WebSocket Entegrasyonu
```javascript
const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
    const { room, device, value } = JSON.parse(event.data);
    this.devices[room][device] = value;
    this.updateStatusIndicators();
};
```

## 🎯 Gelişmiş Özellikler

### Animasyonlar (Framer Motion)
```jsx
import { motion } from 'framer-motion';

const Hotspot = ({ position, room, label, onClick }) => (
    <motion.div
        className="hotspot"
        style={{ left: position.x, top: position.y }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick(room)}
    >
        {/* Hotspot içeriği */}
    </motion.div>
);
```

### Gerçek Zamanlı Bildirimler
```javascript
// Toast bildirimleri için
const showNotification = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
};
```

## 📱 Responsive Tasarım

- **Desktop**: Tam özellikli deneyim
- **Tablet**: Dokunmatik optimizasyonu
- **Mobile**: Basitleştirilmiş kontroller

## 🔧 Teknik Notlar

1. **Performans**: Debounced event handlers kullanın
2. **Erişilebilirlik**: ARIA labels ekleyin
3. **SEO**: Semantic HTML yapısı kullanın
4. **Güvenlik**: Input validation ekleyin
5. **Testing**: Jest/Testing Library ile test yazın

## 🚀 Gelecek Özellikler

- [ ] Sesli kontrol entegrasyonu
- [ ] Zamanlayıcı/Programlama özellikleri
- [ ] Enerji tüketimi grafikları
- [ ] Güvenlik kamera entegrasyonu
- [ ] Hava durumu entegrasyonu
- [ ] Mobil uygulama desteği

## 🐛 Sorun Giderme

### Hotspot'lar görünmüyor
- CSS dosyasının yüklendiğini kontrol edin
- Z-index değerlerini kontrol edin
- Console'da JavaScript hataları var mı bakın

### Panel açılmıyor
- Event listener'ların doğru eklendiğini kontrol edin
- Room adlarının doğru olduğunu kontrol edin
- Browser developer tools'da network tab'ı kontrol edin

### Responsive sorunlar
- Tailwind CSS'in yüklendiğini kontrol edin
- Viewport meta tag'inin ekli olduğunu kontrol edin
- CSS grid/flexbox desteğini kontrol edin

---

**BeğonTech** - Teknolojide geleceği şekillendiriyoruz 🚀