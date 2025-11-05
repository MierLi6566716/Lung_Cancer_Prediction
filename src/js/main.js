// ========== MAIN APPLICATION INITIALIZATION ==========

// Initialize chart when DOM and D3 are ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the home page and the chart container exists
    const chartContainer = document.getElementById('homeChart');
    
    if (chartContainer) {
        // Create the interactive line chart
        const chart = new InteractiveLineChart('homeChart', 'chartLegend', {
            width: 900,
            height: 450,
            months: 24,
            sectors: [
                { name: 'Technology', color: '#1e293b', active: true },
                { name: 'Healthcare', color: '#334155', active: true },
                { name: 'Finance', color: '#475569', active: true },
                { name: 'Energy', color: '#64748b', active: true }
            ]
        });
        
        console.log('Interactive chart initialized successfully');
    }
});
