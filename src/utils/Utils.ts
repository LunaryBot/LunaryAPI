class Utils {
    static generateToken() {
        return (Date.now().toString(36) + Array(4).fill(0).map(() => Math.random().toString(36)).join('')).split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c).join('').replace(/\./g, '');
    }
}

export default Utils;