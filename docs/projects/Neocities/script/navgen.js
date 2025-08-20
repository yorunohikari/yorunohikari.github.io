// nav-generator.js
// Add this script to generate navigation automatically

document.addEventListener('DOMContentLoaded', function() {
    // Define your navigation items
    const navItems = [
        { href: '/', text: 'home' },
        { href: '/projects/', text: 'projects' },
        { href: '/blog/', text: 'blog' },
        { href: '/dreams/', text: 'dream archive' },
        { href: '/about/', text: 'about' }
    ];

    // Find the nav container
    const navContainer = document.querySelector('.nav');
    
    if (navContainer) {
        // Clear any existing content
        navContainer.innerHTML = '';
        
        // Generate navigation links
        navItems.forEach(item => {
            const link = document.createElement('a');
            link.href = item.href;
            link.className = 'nav-link';
            link.textContent = item.text;
            
            // Optional: Add active state detection
            if (window.location.pathname === item.href || 
                (item.href !== '/' && window.location.pathname.startsWith(item.href))) {
                link.classList.add('active');
            }
            
            navContainer.appendChild(link);
        });
    }
});

// Alternative version with more flexibility
function generateNavigation(customItems = null) {
    const defaultItems = [
        { href: '/', text: 'home' },
        { href: '/projects/', text: 'projects' },
        { href: '/blog/', text: 'blog' },
        { href: '/dreams/', text: 'dream archive' },
        { href: '/about/', text: 'about' }
    ];
    
    const navItems = customItems || defaultItems;
    const navContainer = document.querySelector('.nav');
    
    if (navContainer) {
        navContainer.innerHTML = '';
        
        navItems.forEach(item => {
            const link = document.createElement('a');
            link.href = item.href;
            link.className = 'nav-link';
            link.textContent = item.text;
            
            // Add active state
            if (window.location.pathname === item.href || 
                (item.href !== '/' && window.location.pathname.startsWith(item.href))) {
                link.classList.add('active');
            }
            
            navContainer.appendChild(link);
        });
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => generateNavigation());