// Event System

const eventSystem = {
    events: {},
    subscribe: function(eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    publish: function(eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(fn => {
                fn(data);
            });
        }
    }
};

// Export the event system
export default eventSystem;

console.log('EventSystem.js loaded');
