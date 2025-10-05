// BloomWatch - NASA Space Apps Challenge 2025
// Global Flowering Phenology Monitoring Application

class BloomWatch {
    constructor() {
        this.map = null;
        this.bloomLayer = null;
        this.citizenLayer = null;
        this.climateLayer = null;
        this.agriculturalLayer = null;
        this.currentTimeIndex = 0;
        this.timeData = [];
        this.isPlaying = false;
        this.playbackSpeed = 1;
        this.bloomData = [];
        this.citizenData = [];
        this.climateData = [];
        this.agriculturalData = [];
        this.selectedRegion = 'global';
        this.currentYear = 2024;
        
        this.init();
    }

    init() {
        this.initializeMap();
        this.setupEventListeners();
        this.loadSampleData();
        this.updateStatistics();
        this.setupTimeAnimation();
    }

    initializeMap() {
        // Initialize Leaflet map with global view
        this.map = L.map('map').setView([20.0, 77.0], 3); // Center on India/Global
        
        // Add base tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add satellite imagery layer
        this.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri'
        });

        // Initialize data layers
        this.bloomLayer = L.layerGroup().addTo(this.map);
        this.citizenLayer = L.layerGroup().addTo(this.map);
        this.climateLayer = L.layerGroup().addTo(this.map);
        this.agriculturalLayer = L.layerGroup().addTo(this.map);

        // Add coordinate display
        this.map.on('mousemove', (e) => {
            const coords = e.latlng;
            document.getElementById('coordinates').textContent = 
                `Lat: ${coords.lat.toFixed(4)}°, Lng: ${coords.lng.toFixed(4)}°`;
        });

        // Add click handler for bloom information
        this.map.on('click', (e) => {
            this.showBloomInfo(e.latlng);
        });

        // Add region selection controls
        this.addRegionControls();
    }

    setupEventListeners() {
        // Data source selection
        document.getElementById('dataSource').addEventListener('change', (e) => {
            this.updateDataSource(e.target.value);
        });

        // Bloom type selection
        document.getElementById('bloomType').addEventListener('change', (e) => {
            this.updateBloomType(e.target.value);
        });

        // Bloom intensity selection
        document.getElementById('bloomIntensity').addEventListener('change', (e) => {
            this.updateBloomIntensity(e.target.value);
        });

        // Time range selection
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.updateTimeRange(e.target.value);
        });

        // Time slider
        document.getElementById('timeSlider').addEventListener('input', (e) => {
            this.updateTimeSlider(e.target.value);
        });

        // ML model selection
        document.getElementById('mlModel').addEventListener('change', (e) => {
            this.updateMLModel(e.target.value);
        });

        // Confidence slider
        document.getElementById('confidence').addEventListener('input', (e) => {
            document.getElementById('confidenceValue').textContent = e.target.value + '%';
            this.updateConfidence(e.target.value);
        });

        // Opacity slider
        document.getElementById('opacity').addEventListener('input', (e) => {
            document.getElementById('opacityValue').textContent = e.target.value + '%';
            this.updateOpacity(e.target.value);
        });

        // Layer toggles
        document.getElementById('showCitizenData').addEventListener('change', (e) => {
            this.toggleCitizenData(e.target.checked);
        });

        document.getElementById('showSatelliteData').addEventListener('change', (e) => {
            this.toggleSatelliteData(e.target.checked);
        });

        document.getElementById('showRadarData').addEventListener('change', (e) => {
            this.toggleRadarData(e.target.checked);
        });

        document.getElementById('showPredictions').addEventListener('change', (e) => {
            this.togglePredictions(e.target.checked);
        });

        // Time animation controls
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        document.getElementById('resetTimeBtn').addEventListener('click', () => {
            this.resetTime();
        });

        document.getElementById('speedBtn').addEventListener('click', () => {
            this.changeSpeed();
        });

        // Citizen science contribution
        document.getElementById('contributeBtn').addEventListener('click', () => {
            this.openContributionModal();
        });

        // Close bloom info panel
        document.getElementById('closeBloomInfo').addEventListener('click', () => {
            this.closeBloomInfo();
        });
    }

    loadSampleData() {
        // Generate sample data for demonstration
        this.bloomData = this.generateGlobalBloomData();
        this.citizenData = this.generateGlobalCitizenData();
        this.climateData = this.generateClimateData();
        this.agriculturalData = this.generateAgriculturalData();
        
        this.renderBloomData();
        this.renderCitizenData();
        this.renderClimateData();
        this.renderAgriculturalData();
        this.updateLegend();
        this.updateEcosystemIndicators();
        this.updateAgriculturalInsights();
    }

    generateGlobalBloomData() {
        const bloomData = [];
        const bloomTypes = ['superbloom', 'wildflower', 'agricultural', 'urban'];
        const intensities = ['low', 'moderate', 'high', 'extreme'];
        
        // Global regions including India and other countries
        const regions = [
            // India
            { name: 'India_North', center: [28.6139, 77.2090], radius: 3, country: 'India' },
            { name: 'India_South', center: [12.9716, 77.5946], radius: 2, country: 'India' },
            { name: 'India_West', center: [19.0760, 72.8777], radius: 2, country: 'India' },
            { name: 'India_East', center: [22.5726, 88.3639], radius: 2, country: 'India' },
            
            // USA
            { name: 'California', center: [36.7783, -119.4179], radius: 2, country: 'USA' },
            { name: 'Texas', center: [31.9686, -99.9018], radius: 1.5, country: 'USA' },
            { name: 'Florida', center: [27.7663, -82.6404], radius: 1, country: 'USA' },
            
            // Europe
            { name: 'France', center: [46.2276, 2.2137], radius: 1.5, country: 'France' },
            { name: 'Italy', center: [41.8719, 12.5674], radius: 1, country: 'Italy' },
            { name: 'Spain', center: [40.4637, -3.7492], radius: 1.5, country: 'Spain' },
            
            // Asia
            { name: 'Japan', center: [36.2048, 138.2529], radius: 1, country: 'Japan' },
            { name: 'China', center: [35.8617, 104.1954], radius: 2, country: 'China' },
            { name: 'Australia', center: [-25.2744, 133.7751], radius: 2, country: 'Australia' },
            
            // Africa
            { name: 'South_Africa', center: [-30.5595, 22.9375], radius: 1.5, country: 'South Africa' },
            { name: 'Morocco', center: [31.6295, -7.9811], radius: 1, country: 'Morocco' },
            
            // South America
            { name: 'Brazil', center: [-14.2350, -51.9253], radius: 2, country: 'Brazil' },
            { name: 'Argentina', center: [-38.4161, -63.6167], radius: 1.5, country: 'Argentina' }
        ];

        regions.forEach(region => {
            for (let i = 0; i < 20; i++) {
                const lat = region.center[0] + (Math.random() - 0.5) * region.radius;
                const lng = region.center[1] + (Math.random() - 0.5) * region.radius;
                const intensity = intensities[Math.floor(Math.random() * intensities.length)];
                const type = bloomTypes[Math.floor(Math.random() * bloomTypes.length)];
                
                bloomData.push({
                    id: `bloom_${region.name}_${i}`,
                    lat: lat,
                    lng: lng,
                    intensity: intensity,
                    type: type,
                    species: this.getRandomSpecies(region.country),
                    confidence: Math.random() * 0.4 + 0.6, // 60-100%
                    date: this.getRandomDate(),
                    area: Math.random() * 1000 + 100, // hectares
                    country: region.country,
                    region: region.name,
                    climateImpact: this.calculateClimateImpact(intensity, type),
                    ecosystemHealth: this.calculateEcosystemHealth(intensity, type),
                    agriculturalValue: this.calculateAgriculturalValue(type, region.country)
                });
            }
        });

        return bloomData;
    }

    generateGlobalCitizenData() {
        const citizenData = [];
        const countries = ['India', 'USA', 'France', 'Italy', 'Spain', 'Japan', 'China', 'Australia', 'Brazil', 'Argentina'];
        
        countries.forEach(country => {
            const species = this.getCountrySpecies(country);
            for (let i = 0; i < 15; i++) {
                const coords = this.getCountryCoordinates(country);
                citizenData.push({
                    id: `citizen_${country}_${i}`,
                    lat: coords.lat + (Math.random() - 0.5) * 5,
                    lng: coords.lng + (Math.random() - 0.5) * 5,
                    species: species[Math.floor(Math.random() * species.length)],
                    date: this.getRandomDate(),
                    observer: `Observer_${country}_${Math.floor(Math.random() * 1000)}`,
                    validated: Math.random() > 0.3,
                    country: country
                });
            }
        });

        return citizenData;
    }

    generateClimateData() {
        const climateData = [];
        const regions = [
            { name: 'India', center: [20.0, 77.0], radius: 8 },
            { name: 'USA', center: [39.8283, -98.5795], radius: 6 },
            { name: 'Europe', center: [54.5260, 15.2551], radius: 4 },
            { name: 'China', center: [35.8617, 104.1954], radius: 6 },
            { name: 'Australia', center: [-25.2744, 133.7751], radius: 4 },
            { name: 'Brazil', center: [-14.2350, -51.9253], radius: 5 },
            { name: 'Africa', center: [-8.7832, 34.5085], radius: 6 }
        ];

        regions.forEach(region => {
            for (let i = 0; i < 10; i++) {
                const lat = region.center[0] + (Math.random() - 0.5) * region.radius;
                const lng = region.center[1] + (Math.random() - 0.5) * region.radius;
                
                climateData.push({
                    id: `climate_${region.name}_${i}`,
                    lat: lat,
                    lng: lng,
                    temperature: 15 + Math.random() * 25, // 15-40°C
                    precipitation: Math.random() * 2000, // 0-2000mm
                    humidity: 30 + Math.random() * 50, // 30-80%
                    windSpeed: Math.random() * 20, // 0-20 m/s
                    pressure: 980 + Math.random() * 40, // 980-1020 hPa
                    region: region.name,
                    climateZone: this.getClimateZone(lat, lng),
                    bloomCorrelation: Math.random() * 0.8 + 0.2 // 0.2-1.0
                });
            }
        });

        return climateData;
    }

    generateAgriculturalData() {
        const agriculturalData = [];
        const crops = ['Rice', 'Wheat', 'Corn', 'Soybean', 'Cotton', 'Sugarcane', 'Potato', 'Tomato'];
        const countries = ['India', 'USA', 'China', 'Brazil', 'Argentina', 'France', 'Italy', 'Spain'];
        
        countries.forEach(country => {
            const countryCrops = this.getCountryCrops(country);
            for (let i = 0; i < 12; i++) {
                const coords = this.getCountryCoordinates(country);
                const crop = countryCrops[Math.floor(Math.random() * countryCrops.length)];
                
                agriculturalData.push({
                    id: `agri_${country}_${i}`,
                    lat: coords.lat + (Math.random() - 0.5) * 4,
                    lng: coords.lng + (Math.random() - 0.5) * 4,
                    crop: crop,
                    plantingDate: this.getRandomDate(),
                    expectedHarvest: this.getHarvestDate(crop),
                    yield: Math.random() * 10 + 2, // 2-12 tons/hectare
                    soilMoisture: Math.random() * 100, // 0-100%
                    fertilizerLevel: Math.random() * 100, // 0-100%
                    pestPressure: Math.random() * 100, // 0-100%
                    country: country,
                    bloomTiming: this.getBloomTiming(crop),
                    harvestPrediction: this.predictHarvest(crop, Math.random())
                });
            }
        });

        return agriculturalData;
    }

    getRandomSpecies(country = 'Global') {
        const speciesByCountry = {
            'India': ['Marigold', 'Jasmine', 'Lotus', 'Hibiscus', 'Rose', 'Sunflower', 'Chrysanthemum', 'Dahlia'],
            'USA': ['California Poppy', 'Bluebonnet', 'Sunflower', 'Wild Rose', 'Lupine', 'Desert Marigold'],
            'France': ['Lavender', 'Sunflower', 'Poppy', 'Rose', 'Lily', 'Tulip'],
            'Italy': ['Sunflower', 'Poppy', 'Rose', 'Lavender', 'Olive Blossom'],
            'Spain': ['Sunflower', 'Poppy', 'Lavender', 'Rose', 'Orange Blossom'],
            'Japan': ['Cherry Blossom', 'Chrysanthemum', 'Lotus', 'Rose', 'Sunflower'],
            'China': ['Peony', 'Lotus', 'Chrysanthemum', 'Rose', 'Plum Blossom'],
            'Australia': ['Wattle', 'Kangaroo Paw', 'Waratah', 'Sunflower', 'Rose'],
            'Brazil': ['Sunflower', 'Rose', 'Hibiscus', 'Orchid', 'Passion Flower'],
            'Argentina': ['Sunflower', 'Rose', 'Dahlia', 'Carnation', 'Lily']
        };
        
        const species = speciesByCountry[country] || speciesByCountry['USA'];
        return species[Math.floor(Math.random() * species.length)];
    }

    getCountrySpecies(country) {
        return this.getRandomSpecies(country).split(',').map(s => s.trim());
    }

    getCountryCoordinates(country) {
        const coordinates = {
            'India': [20.0, 77.0],
            'USA': [39.8283, -98.5795],
            'France': [46.2276, 2.2137],
            'Italy': [41.8719, 12.5674],
            'Spain': [40.4637, -3.7492],
            'Japan': [36.2048, 138.2529],
            'China': [35.8617, 104.1954],
            'Australia': [-25.2744, 133.7751],
            'Brazil': [-14.2350, -51.9253],
            'Argentina': [-38.4161, -63.6167]
        };
        return { lat: coordinates[country][0], lng: coordinates[country][1] };
    }

    getCountryCrops(country) {
        const cropsByCountry = {
            'India': ['Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Potato', 'Tomato', 'Mango'],
            'USA': ['Corn', 'Wheat', 'Soybean', 'Cotton', 'Potato', 'Tomato'],
            'China': ['Rice', 'Wheat', 'Corn', 'Soybean', 'Potato', 'Tomato'],
            'Brazil': ['Soybean', 'Corn', 'Sugarcane', 'Coffee', 'Cotton'],
            'Argentina': ['Soybean', 'Corn', 'Wheat', 'Sunflower'],
            'France': ['Wheat', 'Corn', 'Sunflower', 'Potato', 'Tomato'],
            'Italy': ['Wheat', 'Corn', 'Tomato', 'Olive', 'Grape'],
            'Spain': ['Wheat', 'Corn', 'Sunflower', 'Olive', 'Tomato']
        };
        return cropsByCountry[country] || ['Wheat', 'Corn', 'Rice'];
    }

    getClimateZone(lat, lng) {
        if (lat > 60) return 'Polar';
        if (lat > 30) return 'Temperate';
        if (lat > -30) return 'Tropical';
        return 'Polar';
    }

    calculateClimateImpact(intensity, type) {
        const impactScores = {
            'low': 0.2, 'moderate': 0.5, 'high': 0.8, 'extreme': 1.0
        };
        const typeMultipliers = {
            'superbloom': 1.5, 'wildflower': 1.0, 'agricultural': 0.8, 'urban': 0.6
        };
        return impactScores[intensity] * typeMultipliers[type];
    }

    calculateEcosystemHealth(intensity, type) {
        const healthScores = {
            'low': 0.3, 'moderate': 0.6, 'high': 0.8, 'extreme': 0.9
        };
        const typeMultipliers = {
            'superbloom': 1.2, 'wildflower': 1.0, 'agricultural': 0.7, 'urban': 0.5
        };
        return healthScores[intensity] * typeMultipliers[type];
    }

    calculateAgriculturalValue(type, country) {
        const typeValues = {
            'agricultural': 0.9, 'wildflower': 0.3, 'superbloom': 0.6, 'urban': 0.1
        };
        const countryMultipliers = {
            'India': 1.2, 'USA': 1.0, 'China': 1.1, 'Brazil': 1.0, 'Argentina': 0.9
        };
        return typeValues[type] * (countryMultipliers[country] || 1.0);
    }

    getHarvestDate(crop) {
        const harvestMonths = {
            'Rice': 6, 'Wheat': 7, 'Corn': 9, 'Soybean': 10, 'Cotton': 11,
            'Sugarcane': 12, 'Potato': 8, 'Tomato': 7, 'Mango': 5, 'Coffee': 11
        };
        const month = harvestMonths[crop] || 8;
        return new Date(2024, month - 1, 15);
    }

    getBloomTiming(crop) {
        const bloomMonths = {
            'Rice': 4, 'Wheat': 5, 'Corn': 7, 'Soybean': 8, 'Cotton': 9,
            'Sugarcane': 10, 'Potato': 6, 'Tomato': 6, 'Mango': 3, 'Coffee': 9
        };
        const month = bloomMonths[crop] || 6;
        return new Date(2024, month - 1, 15);
    }

    predictHarvest(crop, bloomQuality) {
        const baseYield = {
            'Rice': 4, 'Wheat': 3, 'Corn': 8, 'Soybean': 2.5, 'Cotton': 1.5,
            'Sugarcane': 80, 'Potato': 25, 'Tomato': 40, 'Mango': 15, 'Coffee': 2
        };
        const base = baseYield[crop] || 5;
        return base * (0.8 + bloomQuality * 0.4); // 80-120% of base yield
    }

    getRandomDate() {
        const start = new Date('2024-01-01');
        const end = new Date('2024-12-31');
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    renderBloomData() {
        this.bloomLayer.clearLayers();
        
        this.bloomData.forEach(bloom => {
            const color = this.getBloomColor(bloom.intensity);
            const size = this.getBloomSize(bloom.area);
            
            const marker = L.circleMarker([bloom.lat, bloom.lng], {
                radius: size,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.7
            });

            marker.bindPopup(`
                <div class="bloom-popup">
                    <h4>${bloom.species}</h4>
                    <p><strong>Country:</strong> ${bloom.country}</p>
                    <p><strong>Type:</strong> ${bloom.type}</p>
                    <p><strong>Intensity:</strong> ${bloom.intensity}</p>
                    <p><strong>Confidence:</strong> ${(bloom.confidence * 100).toFixed(1)}%</p>
                    <p><strong>Area:</strong> ${bloom.area.toFixed(1)} hectares</p>
                    <p><strong>Date:</strong> ${bloom.date.toLocaleDateString()}</p>
                    <p><strong>Climate Impact:</strong> ${(bloom.climateImpact * 100).toFixed(1)}%</p>
                    <p><strong>Ecosystem Health:</strong> ${(bloom.ecosystemHealth * 100).toFixed(1)}%</p>
                    <p><strong>Agricultural Value:</strong> ${(bloom.agriculturalValue * 100).toFixed(1)}%</p>
                </div>
            `);

            marker.bloomData = bloom;
            this.bloomLayer.addLayer(marker);
        });

    }

    renderCitizenData() {
        this.citizenLayer.clearLayers();
        
        this.citizenData.forEach(observation => {
            const color = observation.validated ? '#28a745' : '#ffc107';
            
            const marker = L.circleMarker([observation.lat, observation.lng], {
                radius: 6,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.7
            });

            marker.bindPopup(`
                <div class="citizen-popup">
                    <h4>${observation.species}</h4>
                    <p><strong>Country:</strong> ${observation.country}</p>
                    <p><strong>Observer:</strong> ${observation.observer}</p>
                    <p><strong>Date:</strong> ${observation.date.toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${observation.validated ? 'Validated' : 'Pending'}</p>
                </div>
            `);

            this.citizenLayer.addLayer(marker);
        });

    }

    renderClimateData() {
        this.climateLayer.clearLayers();
        
        this.climateData.forEach(climate => {
            const color = this.getClimateColor(climate.temperature);
            
            const marker = L.circleMarker([climate.lat, climate.lng], {
                radius: 8,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 0.6,
                fillOpacity: 0.5
            });

            marker.bindPopup(`
                <div class="climate-popup">
                    <h4>Climate Station</h4>
                    <p><strong>Region:</strong> ${climate.region}</p>
                    <p><strong>Temperature:</strong> ${climate.temperature.toFixed(1)}°C</p>
                    <p><strong>Precipitation:</strong> ${climate.precipitation.toFixed(1)}mm</p>
                    <p><strong>Humidity:</strong> ${climate.humidity.toFixed(1)}%</p>
                    <p><strong>Wind Speed:</strong> ${climate.windSpeed.toFixed(1)} m/s</p>
                    <p><strong>Pressure:</strong> ${climate.pressure.toFixed(1)} hPa</p>
                    <p><strong>Climate Zone:</strong> ${climate.climateZone}</p>
                    <p><strong>Bloom Correlation:</strong> ${(climate.bloomCorrelation * 100).toFixed(1)}%</p>
                </div>
            `);

            this.climateLayer.addLayer(marker);
        });

    }

    renderAgriculturalData() {
        this.agriculturalLayer.clearLayers();
        
        this.agriculturalData.forEach(field => {
            const color = this.getCropColor(field.crop);
            
            const marker = L.circleMarker([field.lat, field.lng], {
                radius: 10,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 0.7,
                fillOpacity: 0.6
            });

            marker.bindPopup(`
                <div class="agricultural-popup">
                    <h4>${field.crop} Field</h4>
                    <p><strong>Country:</strong> ${field.country}</p>
                    <p><strong>Planting Date:</strong> ${field.plantingDate.toLocaleDateString()}</p>
                    <p><strong>Expected Harvest:</strong> ${field.expectedHarvest.toLocaleDateString()}</p>
                    <p><strong>Bloom Timing:</strong> ${field.bloomTiming.toLocaleDateString()}</p>
                    <p><strong>Predicted Yield:</strong> ${field.harvestPrediction.toFixed(1)} tons/hectare</p>
                    <p><strong>Soil Moisture:</strong> ${field.soilMoisture.toFixed(1)}%</p>
                    <p><strong>Fertilizer Level:</strong> ${field.fertilizerLevel.toFixed(1)}%</p>
                    <p><strong>Pest Pressure:</strong> ${field.pestPressure.toFixed(1)}%</p>
                </div>
            `);

            this.agriculturalLayer.addLayer(marker);
        });

    }


    getClimateColor(temperature) {
        if (temperature < 0) return '#0000FF'; // Blue for cold
        if (temperature < 10) return '#0080FF'; // Light blue
        if (temperature < 20) return '#00FF00'; // Green
        if (temperature < 30) return '#FFFF00'; // Yellow
        if (temperature < 40) return '#FF8000'; // Orange
        return '#FF0000'; // Red for hot
    }

    getCropColor(crop) {
        const colors = {
            'Rice': '#90EE90', 'Wheat': '#F0E68C', 'Corn': '#FFD700',
            'Soybean': '#8FBC8F', 'Cotton': '#F5F5DC', 'Sugarcane': '#32CD32',
            'Potato': '#DDA0DD', 'Tomato': '#FF6347', 'Mango': '#FFA500',
            'Coffee': '#8B4513', 'Olive': '#808000', 'Grape': '#9370DB'
        };
        return colors[crop] || '#90EE90';
    }

    getBloomColor(intensity) {
        const colors = {
            'low': '#90EE90',
            'moderate': '#FFD700',
            'high': '#FF8C00',
            'extreme': '#FF4500'
        };
        return colors[intensity] || '#90EE90';
    }

    getBloomSize(area) {
        if (area < 200) return 8;
        if (area < 500) return 12;
        if (area < 800) return 16;
        return 20;
    }

    updateDataSource(source) {
        console.log('Updating data source:', source);
        // In a real implementation, this would fetch data from the selected source
        this.showLoadingSpinner();
        setTimeout(() => {
            this.hideLoadingSpinner();
            this.updateStatistics();
        }, 1000);
    }

    updateBloomType(type) {
        console.log('Updating bloom type:', type);
        // Filter and re-render bloom data based on type
        this.renderBloomData();
    }

    updateBloomIntensity(intensity) {
        console.log('Updating bloom intensity:', intensity);
        // Filter blooms by intensity level
        this.renderBloomData();
    }

    updateTimeRange(range) {
        console.log('Updating time range:', range);
        // Update time slider range and labels
        const slider = document.getElementById('timeSlider');
        const timeStart = document.getElementById('timeStart');
        const timeEnd = document.getElementById('timeEnd');
        
        switch(range) {
            case 'recent':
                timeStart.textContent = 'Jan 2024';
                timeEnd.textContent = 'Dec 2024';
                break;
            case 'historical':
                timeStart.textContent = 'Jan 2020';
                timeEnd.textContent = 'Dec 2023';
                break;
            case 'seasonal':
                timeStart.textContent = 'Spring 2024';
                timeEnd.textContent = 'Fall 2024';
                break;
            case 'monthly':
                timeStart.textContent = 'Nov 2024';
                timeEnd.textContent = 'Dec 2024';
                break;
        }
    }

    updateTimeSlider(value) {
        console.log('Time slider value:', value);
        // Update map visualization based on time
        this.currentTimeIndex = parseInt(value);
        const timeData = this.timeData[this.currentTimeIndex];
        
        if (timeData) {
            // Update time display
            const timeDisplay = document.querySelector('.time-labels');
            if (timeDisplay) {
                timeDisplay.innerHTML = `
                    <span id="timeStart">${timeData.month} ${timeData.year}</span>
                    <span id="timeEnd">Current</span>
                `;
            }
            
            // Filter and render data based on current time
            this.renderTimeBasedData(timeData);
        }
    }

    renderTimeBasedData(timeData) {
        // Filter blooms based on time
        const filteredBlooms = this.bloomData.filter(bloom => {
            const bloomMonth = bloom.date.getMonth();
            return bloomMonth === timeData.index;
        });
        
        // Render filtered data
        this.renderFilteredBloomData(filteredBlooms);
        this.renderCitizenData();
        this.renderClimateData();
        this.renderAgriculturalData();
    }

    renderFilteredBloomData(blooms) {
        this.bloomLayer.clearLayers();
        
        blooms.forEach(bloom => {
            const color = this.getBloomColor(bloom.intensity);
            const size = this.getBloomSize(bloom.area);
            
            const marker = L.circleMarker([bloom.lat, bloom.lng], {
                radius: size,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.7
            });

            marker.bindPopup(`
                <div class="bloom-popup">
                    <h4>${bloom.species}</h4>
                    <p><strong>Country:</strong> ${bloom.country}</p>
                    <p><strong>Type:</strong> ${bloom.type}</p>
                    <p><strong>Intensity:</strong> ${bloom.intensity}</p>
                    <p><strong>Confidence:</strong> ${(bloom.confidence * 100).toFixed(1)}%</p>
                    <p><strong>Area:</strong> ${bloom.area.toFixed(1)} hectares</p>
                    <p><strong>Date:</strong> ${bloom.date.toLocaleDateString()}</p>
                    <p><strong>Climate Impact:</strong> ${(bloom.climateImpact * 100).toFixed(1)}%</p>
                    <p><strong>Ecosystem Health:</strong> ${(bloom.ecosystemHealth * 100).toFixed(1)}%</p>
                    <p><strong>Agricultural Value:</strong> ${(bloom.agriculturalValue * 100).toFixed(1)}%</p>
                </div>
            `);

            marker.bloomData = bloom;
            this.bloomLayer.addLayer(marker);
        });
    }

    updateMLModel(model) {
        console.log('Updating ML model:', model);
        if (model !== 'none') {
            this.showLoadingSpinner();
            setTimeout(() => {
                this.hideLoadingSpinner();
                this.updateStatistics();
            }, 1500);
        }
    }

    updateConfidence(confidence) {
        console.log('Updating confidence threshold:', confidence);
        // Filter blooms by confidence level
        this.renderBloomData();
    }

    updateOpacity(opacity) {
        const opacityValue = opacity / 100;
        this.bloomLayer.setOpacity(opacityValue);
        this.citizenLayer.setOpacity(opacityValue);
    }

    toggleCitizenData(show) {
        if (show) {
            this.map.addLayer(this.citizenLayer);
        } else {
            this.map.removeLayer(this.citizenLayer);
        }
    }

    toggleSatelliteData(show) {
        if (show) {
            this.map.addLayer(this.satelliteLayer);
        } else {
            this.map.removeLayer(this.satelliteLayer);
        }
    }

    toggleRadarData(show) {
        console.log('Toggling radar data:', show);
        // In a real implementation, this would toggle radar data layer
    }

    togglePredictions(show) {
        console.log('Toggling ML predictions:', show);
        // In a real implementation, this would toggle ML prediction layer
    }

    setupTimeAnimation() {
        this.timeData = this.generateTimeData();
        this.animationInterval = null;
        this.updateTimeLabels();
    }

    generateTimeData() {
        // Generate comprehensive time series data for animation
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((month, index) => ({
            month: month,
            index: index,
            year: this.currentYear,
            blooms: this.bloomData.filter(() => Math.random() > 0.3),
            climate: this.climateData.filter(() => Math.random() > 0.4),
            agricultural: this.agriculturalData.filter(() => Math.random() > 0.5)
        }));
    }

    updateTimeLabels() {
        const timeStart = document.getElementById('timeStart');
        const timeEnd = document.getElementById('timeEnd');
        const slider = document.getElementById('timeSlider');
        
        timeStart.textContent = `Jan ${this.currentYear}`;
        timeEnd.textContent = `Dec ${this.currentYear}`;
        slider.max = this.timeData.length - 1;
        slider.value = this.timeData.length - 1;
    }

    addRegionControls() {
        // Add region selection dropdown to the control panel
        const controlPanel = document.querySelector('.control-panel');
        const regionSection = document.createElement('div');
        regionSection.className = 'control-section';
        regionSection.innerHTML = `
            <h2><i class="fas fa-globe"></i> Region Selection</h2>
            <div class="control-group">
                <label for="regionSelect">Focus Region:</label>
                <select id="regionSelect" class="control-select">
                    <option value="global">Global View</option>
                    <option value="india">India</option>
                    <option value="usa">United States</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                    <option value="africa">Africa</option>
                    <option value="south-america">South America</option>
                    <option value="australia">Australia</option>
                </select>
            </div>
        `;
        
        // Insert after the first control section
        controlPanel.insertBefore(regionSection, controlPanel.children[1]);
        
        // Add event listener for region selection
        document.getElementById('regionSelect').addEventListener('change', (e) => {
            this.updateRegion(e.target.value);
        });
    }

    updateRegion(region) {
        this.selectedRegion = region;
        const regionViews = {
            'global': { center: [20.0, 77.0], zoom: 3 },
            'india': { center: [20.0, 77.0], zoom: 5 },
            'usa': { center: [39.8283, -98.5795], zoom: 4 },
            'europe': { center: [54.5260, 15.2551], zoom: 4 },
            'asia': { center: [35.8617, 104.1954], zoom: 4 },
            'africa': { center: [-8.7832, 34.5085], zoom: 4 },
            'south-america': { center: [-14.2350, -51.9253], zoom: 4 },
            'australia': { center: [-25.2744, 133.7751], zoom: 4 }
        };
        
        const view = regionViews[region];
        this.map.setView(view.center, view.zoom);
        
        // Filter data based on region
        this.filterDataByRegion(region);
    }

    filterDataByRegion(region) {
        // In a real implementation, this would filter data based on the selected region
        console.log('Filtering data for region:', region);
        this.renderBloomData();
        this.renderCitizenData();
        this.renderClimateData();
        this.renderAgriculturalData();
    }

    updateEcosystemIndicators() {
        // Calculate ecosystem health indicators
        const totalBlooms = this.bloomData.length;
        const superblooms = this.bloomData.filter(b => b.type === 'superbloom').length;
        const avgEcosystemHealth = this.bloomData.reduce((sum, b) => sum + b.ecosystemHealth, 0) / totalBlooms;
        const avgClimateImpact = this.bloomData.reduce((sum, b) => sum + b.climateImpact, 0) / totalBlooms;
        
        // Update ecosystem indicators in the UI
        this.updateEcosystemDisplay({
            totalBlooms,
            superblooms,
            ecosystemHealth: avgEcosystemHealth,
            climateImpact: avgClimateImpact,
            biodiversityIndex: this.calculateBiodiversityIndex(),
            climateCorrelation: this.calculateClimateCorrelation()
        });
    }

    updateAgriculturalInsights() {
        // Calculate agricultural insights
        const totalFields = this.agriculturalData.length;
        const avgYield = this.agriculturalData.reduce((sum, f) => sum + f.harvestPrediction, 0) / totalFields;
        const avgSoilMoisture = this.agriculturalData.reduce((sum, f) => sum + f.soilMoisture, 0) / totalFields;
        const pestPressure = this.agriculturalData.reduce((sum, f) => sum + f.pestPressure, 0) / totalFields;
        
        // Update agricultural insights in the UI
        this.updateAgriculturalDisplay({
            totalFields,
            avgYield,
            avgSoilMoisture,
            pestPressure,
            harvestPrediction: this.predictOverallHarvest(),
            cropDiversity: this.calculateCropDiversity()
        });
    }

    calculateBiodiversityIndex() {
        const speciesCount = new Set(this.bloomData.map(b => b.species)).size;
        const countryCount = new Set(this.bloomData.map(b => b.country)).size;
        return (speciesCount * countryCount) / 100; // Normalized index
    }

    calculateClimateCorrelation() {
        const bloomCount = this.bloomData.length;
        const climateCount = this.climateData.length;
        return Math.min(bloomCount / climateCount, 1.0);
    }

    calculateCropDiversity() {
        const cropCount = new Set(this.agriculturalData.map(f => f.crop)).size;
        const countryCount = new Set(this.agriculturalData.map(f => f.country)).size;
        return cropCount * countryCount;
    }

    predictOverallHarvest() {
        const totalYield = this.agriculturalData.reduce((sum, f) => sum + f.harvestPrediction, 0);
        const avgYield = totalYield / this.agriculturalData.length;
        return avgYield * (0.9 + Math.random() * 0.2); // 90-110% of average
    }

    updateEcosystemDisplay(indicators) {
        // Update ecosystem indicators in the statistics section
        const ecosystemStats = document.createElement('div');
        ecosystemStats.className = 'ecosystem-indicators';
        ecosystemStats.innerHTML = `
            <h3><i class="fas fa-leaf"></i> Ecosystem Indicators</h3>
            <div class="stat-item">
                <span class="stat-label">Ecosystem Health:</span>
                <span class="stat-value">${(indicators.ecosystemHealth * 100).toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Climate Impact:</span>
                <span class="stat-value">${(indicators.climateImpact * 100).toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Biodiversity Index:</span>
                <span class="stat-value">${indicators.biodiversityIndex.toFixed(2)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Climate Correlation:</span>
                <span class="stat-value">${(indicators.climateCorrelation * 100).toFixed(1)}%</span>
            </div>
        `;
        
        // Add to statistics section
        const statistics = document.querySelector('.statistics');
        if (statistics) {
            statistics.appendChild(ecosystemStats);
        }
    }

    updateAgriculturalDisplay(insights) {
        // Update agricultural insights in the statistics section
        const agriculturalStats = document.createElement('div');
        agriculturalStats.className = 'agricultural-insights';
        agriculturalStats.innerHTML = `
            <h3><i class="fas fa-seedling"></i> Agricultural Insights</h3>
            <div class="stat-item">
                <span class="stat-label">Total Fields:</span>
                <span class="stat-value">${insights.totalFields}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Avg Yield:</span>
                <span class="stat-value">${insights.avgYield.toFixed(1)} t/ha</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Soil Moisture:</span>
                <span class="stat-value">${insights.avgSoilMoisture.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Pest Pressure:</span>
                <span class="stat-value">${insights.pestPressure.toFixed(1)}%</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Harvest Prediction:</span>
                <span class="stat-value">${insights.harvestPrediction.toFixed(1)} t/ha</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Crop Diversity:</span>
                <span class="stat-value">${insights.cropDiversity}</span>
            </div>
        `;
        
        // Add to statistics section
        const statistics = document.querySelector('.statistics');
        if (statistics) {
            statistics.appendChild(agriculturalStats);
        }
    }

    togglePlayPause() {
        const playBtn = document.getElementById('playPauseBtn');
        const icon = playBtn.querySelector('i');
        
        if (this.isPlaying) {
            this.pauseAnimation();
            icon.className = 'fas fa-play';
        } else {
            this.playAnimation();
            icon.className = 'fas fa-pause';
        }
    }

    playAnimation() {
        this.isPlaying = true;
        this.animationInterval = setInterval(() => {
            this.currentTimeIndex = (this.currentTimeIndex + 1) % this.timeData.length;
            document.getElementById('timeSlider').value = this.currentTimeIndex;
            this.updateTimeSlider(this.currentTimeIndex);
            
            // Update statistics during animation
            this.updateStatistics();
            this.updateEcosystemIndicators();
            this.updateAgriculturalInsights();
        }, 1000 / this.playbackSpeed);
    }

    pauseAnimation() {
        this.isPlaying = false;
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }

    resetTime() {
        this.pauseAnimation();
        this.currentTimeIndex = 0;
        document.getElementById('timeSlider').value = 0;
        document.getElementById('playPauseBtn').querySelector('i').className = 'fas fa-play';
        this.updateTimeSlider(0);
    }

    changeSpeed() {
        const speeds = [0.5, 1, 2, 4];
        const currentIndex = speeds.indexOf(this.playbackSpeed);
        this.playbackSpeed = speeds[(currentIndex + 1) % speeds.length];
        
        document.getElementById('speedBtn').innerHTML = 
            `<i class="fas fa-tachometer-alt"></i> ${this.playbackSpeed}x`;
        
        if (this.isPlaying) {
            this.pauseAnimation();
            this.playAnimation();
        }
    }

    showBloomInfo(latlng) {
        const panel = document.getElementById('bloomInfoPanel');
        const title = document.getElementById('bloomTitle');
        const content = document.getElementById('bloomContent');
        
        // Find nearest bloom
        const nearestBloom = this.findNearestBloom(latlng);
        
        if (nearestBloom) {
            title.textContent = nearestBloom.species;
            content.innerHTML = `
                <div class="bloom-details">
                    <p><strong>Type:</strong> ${nearestBloom.type}</p>
                    <p><strong>Intensity:</strong> ${nearestBloom.intensity}</p>
                    <p><strong>Confidence:</strong> ${(nearestBloom.confidence * 100).toFixed(1)}%</p>
                    <p><strong>Area:</strong> ${nearestBloom.area.toFixed(1)} hectares</p>
                    <p><strong>Date:</strong> ${nearestBloom.date.toLocaleDateString()}</p>
                    <p><strong>Coordinates:</strong> ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}</p>
                </div>
            `;
        } else {
            title.textContent = 'No Bloom Data';
            content.innerHTML = '<p>No bloom data available at this location.</p>';
        }
        
        panel.style.display = 'block';
    }

    findNearestBloom(latlng) {
        let nearest = null;
        let minDistance = Infinity;
        
        this.bloomData.forEach(bloom => {
            const distance = this.map.distance(latlng, [bloom.lat, bloom.lng]);
            if (distance < minDistance && distance < 50000) { // Within 50km
                minDistance = distance;
                nearest = bloom;
            }
        });
        
        return nearest;
    }

    closeBloomInfo() {
        document.getElementById('bloomInfoPanel').style.display = 'none';
    }

    openContributionModal() {
        // In a real implementation, this would open a modal for citizen science contributions
        alert('Citizen Science Contribution feature would open here. This would allow users to submit their own bloom observations.');
    }

    updateStatistics() {
        // Update statistics display
        const activeBlooms = this.bloomData.length;
        const superblooms = this.bloomData.filter(b => b.type === 'superbloom').length;
        const speciesCount = new Set(this.bloomData.map(b => b.species)).size;
        const avgConfidence = this.bloomData.reduce((sum, b) => sum + b.confidence, 0) / this.bloomData.length;
        const countriesCount = new Set(this.bloomData.map(b => b.country)).size;
        
        document.getElementById('activeBlooms').textContent = activeBlooms.toLocaleString();
        document.getElementById('superblooms').textContent = superblooms;
        document.getElementById('speciesCount').textContent = speciesCount;
        document.getElementById('predictionAccuracy').textContent = (avgConfidence * 100).toFixed(1) + '%';
        
        // Update citizen science stats
        const globeObservations = this.citizenData.length;
        const validatedBlooms = this.citizenData.filter(c => c.validated).length;
        
        document.getElementById('globeObservations').textContent = globeObservations.toLocaleString();
        document.getElementById('validatedBlooms').textContent = validatedBlooms.toLocaleString();
        
        // Add global statistics
        this.updateGlobalStatistics(countriesCount);
    }

    updateGlobalStatistics(countriesCount) {
        // Add or update global statistics display
        let globalStats = document.querySelector('.global-statistics');
        if (!globalStats) {
            globalStats = document.createElement('div');
            globalStats.className = 'global-statistics';
            const statistics = document.querySelector('.statistics');
            if (statistics) {
                statistics.appendChild(globalStats);
            }
        }
        
        globalStats.innerHTML = `
            <h3><i class="fas fa-globe"></i> Global Coverage</h3>
            <div class="stat-item">
                <span class="stat-label">Countries Covered:</span>
                <span class="stat-value">${countriesCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Climate Stations:</span>
                <span class="stat-value">${this.climateData.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Agricultural Fields:</span>
                <span class="stat-value">${this.agriculturalData.length}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Current Region:</span>
                <span class="stat-value">${this.selectedRegion}</span>
            </div>
        `;
    }

    updateLegend() {
        const gradient = document.getElementById('legendGradient');
        gradient.style.background = 'linear-gradient(to right, #90EE90, #FFD700, #FF8C00, #FF4500)';
    }

    showLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'flex';
    }

    hideLoadingSpinner() {
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bloomWatch = new BloomWatch();
});

