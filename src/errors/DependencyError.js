export default class DependencyError extends Error {
    constructor(message) {
        super();
        this.name = 'DependencyError';
        this.message = message;
    }
}