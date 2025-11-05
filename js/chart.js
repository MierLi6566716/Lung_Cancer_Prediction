// ========== INTERACTIVE D3 MULTI-LINE CHART ==========

class InteractiveLineChart {
    constructor(containerId, legendId, options = {}) {
        this.containerId = containerId;
        this.legendId = legendId;
        this.margin = options.margin || {top: 20, right: 120, bottom: 40, left: 60};
        this.width = (options.width || 900) - this.margin.left - this.margin.right;
        this.height = (options.height || 450) - this.margin.top - this.margin.bottom;
        
        this.sectors = options.sectors || [
            { name: 'Technology', color: '#1e293b', active: true },
            { name: 'Healthcare', color: '#334155', active: true },
            { name: 'Finance', color: '#475569', active: true },
            { name: 'Energy', color: '#64748b', active: true }
        ];
        
        this.months = options.months || 24;
        this.data = [];
        
        this.init();
    }
    
    init() {
        this.createSVG();
        this.createTooltip();
        this.generateData();
        this.createScales();
        this.drawGrid();
        this.drawLines();
        this.drawAxes();
        this.createLegend();
    }
    
    createSVG() {
        this.svg = d3.select(`#${this.containerId}`)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    }
    
    createTooltip() {
        this.tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
    }
    
    generateData() {
        this.data = this.sectors.map(sector => {
            const trend = Math.random() * 2 - 0.5;
            const volatility = 3 + Math.random() * 2;
            const baseValue = 60 + Math.random() * 20;
            
            return {
                name: sector.name,
                color: sector.color,
                active: sector.active,
                values: Array.from({length: this.months}, (_, i) => ({
                    month: i,
                    value: baseValue + trend * i + Math.sin(i / 2) * volatility + (Math.random() - 0.5) * 2
                }))
            };
        });
    }
    
    createScales() {
        this.x = d3.scaleLinear()
            .domain([0, this.months - 1])
            .range([0, this.width]);
        
        this.y = d3.scaleLinear()
            .domain([
                d3.min(this.data, d => d3.min(d.values, v => v.value)) * 0.95,
                d3.max(this.data, d => d3.max(d.values, v => v.value)) * 1.05
            ])
            .range([this.height, 0]);
    }
    
    drawGrid() {
        const gridLines = this.svg.append("g")
            .attr("class", "grid")
            .attr("opacity", 0.1);
        
        gridLines.selectAll("line.horizontal")
            .data(this.y.ticks(8))
            .enter()
            .append("line")
            .attr("class", "horizontal")
            .attr("x1", 0)
            .attr("x2", this.width)
            .attr("y1", d => this.y(d))
            .attr("y2", d => this.y(d))
            .attr("stroke", "#6b7280");
    }
    
    drawLines() {
        const line = d3.line()
            .x(d => this.x(d.month))
            .y(d => this.y(d.value))
            .curve(d3.curveMonotoneX);
        
        const lines = this.svg.selectAll(".line-group")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", "line-group");
        
        // Draw line paths
        lines.append("path")
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", d => d.color)
            .attr("stroke-width", 2.5)
            .attr("d", d => line(d.values))
            .on("mouseover", (event, d) => {
                if (d.active) {
                    d3.select(event.currentTarget).attr("stroke-width", 4);
                    this.highlightLegendItem(d.name, true);
                }
            })
            .on("mouseout", (event, d) => {
                if (d.active) {
                    d3.select(event.currentTarget).attr("stroke-width", 2.5);
                    this.highlightLegendItem(d.name, false);
                }
            });
        
        // Add interactive dots
        lines.each((lineData, i, nodes) => {
            d3.select(nodes[i])
                .selectAll(".dot")
                .data(lineData.values)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => this.x(d.month))
                .attr("cy", d => this.y(d.value))
                .attr("r", 4)
                .attr("fill", lineData.color)
                .attr("stroke", "#fff")
                .attr("stroke-width", 2)
                .attr("opacity", 0)
                .on("mouseover", (event, d) => {
                    if (lineData.active) {
                        d3.select(event.currentTarget).attr("opacity", 1).attr("r", 6);
                        this.showTooltip(event, lineData.name, d);
                    }
                })
                .on("mouseout", (event) => {
                    if (lineData.active) {
                        d3.select(event.currentTarget).attr("opacity", 0).attr("r", 4);
                        this.hideTooltip();
                    }
                });
        });
    }
    
    drawAxes() {
        // X axis
        this.svg.append("g")
            .attr("transform", `translate(0,${this.height})`)
            .call(d3.axisBottom(this.x).ticks(12).tickFormat(d => `M${d + 1}`))
            .style("color", "#6b7280");
        
        // Y axis
        this.svg.append("g")
            .call(d3.axisLeft(this.y).ticks(8))
            .style("color", "#6b7280");
        
        // X axis label
        this.svg.append("text")
            .attr("x", this.width / 2)
            .attr("y", this.height + 35)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#6b7280")
            .text("Month");
        
        // Y axis label
        this.svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -this.height / 2)
            .attr("y", -45)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#6b7280")
            .text("Index Value");
    }
    
    createLegend() {
        const legend = d3.select(`#${this.legendId}`);
        
        const legendItems = legend.selectAll(".legend-item")
            .data(this.sectors)
            .enter()
            .append("div")
            .attr("class", "legend-item flex items-center gap-2 cursor-pointer")
            .on("click", (event, d) => {
                this.toggleLine(d.name);
            })
            .on("mouseover", (event, d) => {
                if (d.active) {
                    this.highlightLine(d.name, true);
                }
            })
            .on("mouseout", (event, d) => {
                if (d.active) {
                    this.highlightLine(d.name, false);
                }
            });
        
        legendItems.append("div")
            .attr("class", "w-6 h-1 rounded")
            .style("background-color", d => d.color);
        
        legendItems.append("span")
            .attr("class", "text-sm text-gray-700")
            .text(d => d.name);
    }
    
    toggleLine(sectorName) {
        const sector = this.sectors.find(s => s.name === sectorName);
        sector.active = !sector.active;
        
        const lineData = this.data.find(d => d.name === sectorName);
        lineData.active = sector.active;
        
        // Update line visibility
        this.svg.selectAll(".line-group")
            .filter(d => d.name === sectorName)
            .selectAll(".line-path, .dot")
            .classed("inactive", !sector.active);
        
        // Update legend
        d3.select(`#${this.legendId}`).selectAll(".legend-item")
            .filter(d => d.name === sectorName)
            .classed("inactive", !sector.active);
    }
    
    highlightLine(sectorName, highlight) {
        this.svg.selectAll(".line-group")
            .filter(d => d.name === sectorName && d.active)
            .select(".line-path")
            .attr("stroke-width", highlight ? 4 : 2.5);
    }
    
    highlightLegendItem(sectorName, highlight) {
        d3.select(`#${this.legendId}`).selectAll(".legend-item")
            .filter(d => d.name === sectorName)
            .style("font-weight", highlight ? "600" : "400")
            .style("transform", highlight ? "scale(1.05)" : "scale(1)");
    }
    
    showTooltip(event, name, data) {
        this.tooltip
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px")
            .html(`
                <strong>${name}</strong><br/>
                Month: ${data.month + 1}<br/>
                Value: ${data.value.toFixed(2)}
            `)
            .classed("show", true);
    }
    
    hideTooltip() {
        this.tooltip.classed("show", false);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveLineChart;
}
