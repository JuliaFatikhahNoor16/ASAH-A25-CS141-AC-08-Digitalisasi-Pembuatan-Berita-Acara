// Main Application
const App = (() => {
    function init() {
        console.log('DigiBA SPA initialized');
        
        // Initialize modules
        if (typeof LoginModule !== 'undefined') {
            LoginModule.init();
        }
        
        if (typeof RegisterModule !== 'undefined') {
            RegisterModule.init();
        }
        
        // Log current page
        if (typeof router !== 'undefined') {
            console.log('Current page:', router.getCurrentPage());
        }
    }

    return {
        init
    };
})();

// Start aplikasi saat DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}
