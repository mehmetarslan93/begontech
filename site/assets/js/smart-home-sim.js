// Akıllı Ev Simülasyonu - Vanilla JS Versiyonu
// BeğonTech için özel olarak hazırlanmıştır

class SmartHomeSim {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.devices = {
            livingRoom: { light: false, tv: false, ac: false },
            kitchen: { light: false, waterSensor: 'Normal' },
            bedroom: { blinds: false, nightMode: false },
            entrance: { doorLock: true },
            balcony: { light: false, irrigation: false }
        };
        this.activePanel = null;
        this.init();
    }

    init() {
        this.render();
        this.setupEventListeners();
    }

    updateDevice(room, device, value) {
        this.devices[room][device] = value;
        this.updateStatusIndicators();
    }

    executeScenario(scenario) {
        switch (scenario) {
            case 'homeArrival':
                this.devices = {
                    livingRoom: { light: true, tv: true, ac: true },
                    kitchen: { light: true, waterSensor: 'Normal' },
                    bedroom: { blinds: true, nightMode: false },
                    entrance: { doorLock: false },
                    balcony: { light: true, irrigation: false }
                };
                break;
            case 'homeDeparture':
                this.devices = {
                    livingRoom: { light: false, tv: false, ac: false },
                    kitchen: { light: false, waterSensor: 'Normal' },
                    bedroom: { blinds: false, nightMode: false },
                    entrance: { doorLock: true },
                    balcony: { light: false, irrigation: false }
                };
                break;
            case 'nightMode':
                this.devices.livingRoom.light = false;
                this.devices.livingRoom.tv = false;
                this.devices.kitchen.light = false;
                this.devices.bedroom.blinds = false;
                this.devices.bedroom.nightMode = true;
                this.devices.entrance.doorLock = true;
                this.devices.balcony.light = false;
                break;
        }
        this.closePanel();
        this.updateStatusIndicators();
    }

    openPanel(room) {
        this.activePanel = room;
        this.renderControlPanel(room);
    }

    closePanel() {
        const panel = document.getElementById('controlPanel');
        if (panel) {
            panel.remove();
        }
        this.activePanel = null;
    }

    render() {
        this.container.innerHTML = `
            <div class="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
                <div class="container mx-auto px-4">
                    <!-- Başlık -->
                    <div class="text-center mb-12">
                        <h2 class="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                            Akıllı Ev Simülasyonu
                        </h2>
                        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                            Evinizdeki akıllı cihazları mavi noktaları tıklayarak kontrol edin
                        </p>
                    </div>

                    <!-- Senaryo Butonları -->
                    <div class="flex flex-wrap justify-center gap-4 mb-8">
                        <button onclick="smartHome.executeScenario('homeArrival')" class="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
                            🏠 Eve Geldim
                        </button>
                        <button onclick="smartHome.executeScenario('homeDeparture')" class="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors">
                            🚪 Evden Çıktım
                        </button>
                        <button onclick="smartHome.executeScenario('nightMode')" class="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                            🌙 Gece Modu
                        </button>
                    </div>

                    <!-- Ev Maketi -->
                    <div class="relative max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                        <!-- Ev görseli container -->
                        <div class="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" id="houseContainer">
                            <!-- Placeholder ev ikonu -->
                            <div class="text-gray-500 text-center">
                                <div class="text-6xl mb-4">🏠</div>
                                <p>Akıllı Ev Planı</p>
                                <p class="text-sm mt-2">Mavi noktalara tıklayın</p>
                            </div>
                            
                            <!-- Hotspotlar -->
                            <div class="hotspot" data-room="livingRoom" data-label="Oturma Odası" style="left: 25%; top: 40%;">
                                <div class="hotspot-pulse"></div>
                            </div>
                            <div class="hotspot" data-room="kitchen" data-label="Mutfak" style="left: 60%; top: 30%;">
                                <div class="hotspot-pulse"></div>
                            </div>
                            <div class="hotspot" data-room="bedroom" data-label="Yatak Odası" style="left: 75%; top: 60%;">
                                <div class="hotspot-pulse"></div>
                            </div>
                            <div class="hotspot" data-room="entrance" data-label="Giriş" style="left: 45%; top: 20%;">
                                <div class="hotspot-pulse"></div>
                            </div>
                            <div class="hotspot" data-room="balcony" data-label="Balkon" style="left: 80%; top: 35%;">
                                <div class="hotspot-pulse"></div>
                            </div>
                        </div>

                        <!-- Durum Göstergeleri -->
                        <div class="p-4 bg-gray-50 border-t" id="statusIndicators">
                            <!-- JavaScript ile doldurulacak -->
                        </div>
                    </div>

                    <!-- Bilgilendirme -->
                    <div class="text-center mt-8 text-sm text-gray-500">
                        <p>💡 Mavi noktalara tıklayarak odaları kontrol edebilirsiniz</p>
                    </div>
                </div>
            </div>
        `;
        
        this.updateStatusIndicators();
    }

    setupEventListeners() {
        // Hotspot click eventi
        this.container.addEventListener('click', (e) => {
            if (e.target.closest('.hotspot')) {
                const hotspot = e.target.closest('.hotspot');
                const room = hotspot.dataset.room;
                this.openPanel(room);
            }
        });
    }

    renderControlPanel(room) {
        // Varsa eski paneli kaldır
        this.closePanel();

        const roomConfigs = {
            livingRoom: {
                title: 'Oturma Odası',
                controls: [
                    { key: 'light', label: 'Işık', type: 'toggle' },
                    { key: 'tv', label: 'TV', type: 'toggle' },
                    { key: 'ac', label: 'Klima', type: 'info', info: 'Otomatik mod aktif' }
                ]
            },
            kitchen: {
                title: 'Mutfak',
                controls: [
                    { key: 'light', label: 'Işık', type: 'toggle' },
                    { key: 'waterSensor', label: 'Su Sensörü', type: 'info', info: 'Durum: Normal' }
                ]
            },
            bedroom: {
                title: 'Yatak Odası',
                controls: [
                    { key: 'blinds', label: 'Panjur', type: 'toggle' },
                    { key: 'nightMode', label: 'Gece Modu', type: 'toggle' }
                ]
            },
            entrance: {
                title: 'Giriş / Koridor',
                controls: [
                    { key: 'doorLock', label: 'Kapı Kilidi', type: 'toggle', invert: true }
                ]
            },
            balcony: {
                title: 'Balkon',
                controls: [
                    { key: 'light', label: 'Işık', type: 'toggle' },
                    { key: 'irrigation', label: 'Sulama Sistemi', type: 'info', info: 'Otomatik program' }
                ]
            }
        };

        const config = roomConfigs[room];
        const roomData = this.devices[room];

        const panelHtml = `
            <div id="controlPanel" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style="z-index: 1000;">
                <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
                    <button onclick="smartHome.closePanel()" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl">×</button>
                    <h3 class="text-xl font-bold text-brand-dark mb-6">${config.title}</h3>
                    <div class="space-y-4">
                        ${config.controls.map(control => `
                            <div class="flex items-center justify-between">
                                <span class="text-gray-700">${control.label}</span>
                                ${control.type === 'toggle' ? `
                                    <button onclick="smartHome.toggleDevice('${room}', '${control.key}', ${control.invert || false})" 
                                            class="px-4 py-2 rounded-lg font-medium transition-colors ${
                                                (control.invert ? !roomData[control.key] : roomData[control.key])
                                                    ? 'bg-brand-primary text-white'
                                                    : 'bg-gray-200 text-gray-700'
                                            }">
                                        ${control.invert 
                                            ? (roomData[control.key] ? 'Kilitli' : 'Açık')
                                            : (roomData[control.key] ? 'Açık' : 'Kapalı')
                                        }
                                    </button>
                                ` : `
                                    <span class="text-sm text-gray-500">${control.info}</span>
                                `}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', panelHtml);
    }

    toggleDevice(room, device, invert = false) {
        const currentValue = this.devices[room][device];
        const newValue = !currentValue;
        this.updateDevice(room, device, newValue);
        this.renderControlPanel(room); // Paneli yeniden render et
    }

    updateStatusIndicators() {
        const statusContainer = document.getElementById('statusIndicators');
        if (!statusContainer) return;

        statusContainer.innerHTML = `
            <div class="flex flex-wrap gap-4 text-sm">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full ${Object.values(this.devices.livingRoom).some(Boolean) ? 'bg-green-500' : 'bg-gray-300'}"></div>
                    <span>Oturma Odası</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full ${this.devices.kitchen.light ? 'bg-green-500' : 'bg-gray-300'}"></div>
                    <span>Mutfak</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full ${Object.values(this.devices.bedroom).some(Boolean) ? 'bg-green-500' : 'bg-gray-300'}"></div>
                    <span>Yatak Odası</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full ${!this.devices.entrance.doorLock ? 'bg-yellow-500' : 'bg-green-500'}"></div>
                    <span>Giriş ${this.devices.entrance.doorLock ? '(Kilitli)' : '(Açık)'}</span>
                </div>
            </div>
        `;
    }
}

// Global değişken tanımla
let smartHome;