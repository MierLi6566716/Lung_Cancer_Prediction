// ========== SIDEBAR INTERACTIVITY ==========

class SidebarManager {
    constructor() {
        this.sidebarLinks = document.querySelectorAll('.sidebar-link');
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.setActiveLink();
    }
    
    attachEventListeners() {
        this.sidebarLinks.forEach(link => {
            // Click event
            link.addEventListener('click', (e) => {
                this.handleClick(link);
            });
            
            // Hover events
            link.addEventListener('mouseenter', () => {
                this.handleMouseEnter(link);
            });
            
            link.addEventListener('mouseleave', () => {
                this.handleMouseLeave(link);
            });
        });
    }
    
    handleClick(clickedLink) {
        // Remove active class from all links
        this.sidebarLinks.forEach(link => {
            link.classList.remove('active', 'text-gray-900', 'font-medium');
            link.classList.add('text-gray-600');
        });
        
        // Add active class to clicked link
        clickedLink.classList.add('active', 'text-gray-900', 'font-medium');
        clickedLink.classList.remove('text-gray-600');
    }
    
    handleMouseEnter(link) {
        if (!link.classList.contains('active')) {
            link.style.paddingLeft = '20px';
        }
    }
    
    handleMouseLeave(link) {
        if (!link.classList.contains('active')) {
            link.style.paddingLeft = '16px';
        }
    }
    
    setActiveLink() {
        // Get current page from URL
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.sidebarLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage) {
                link.classList.add('active', 'text-gray-900', 'font-medium');
                link.classList.remove('text-gray-600');
            }
        });
    }
}

// Initialize sidebar when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SidebarManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SidebarManager;
}
