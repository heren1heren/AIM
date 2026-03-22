import authController from '../../src/controllers/authController.js';
import authService from '../../src/services/authService.js';

jest.mock('../../src/services/authService.js');

describe('Auth Controller - Login', () => {
    const mockReq = {
        body: {
            username: 'admin1',
            password: 'password123',
        },
    };

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    const next = jest.fn();

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should return a token and roles for valid credentials', async () => {

        authService.verifyCredentials.mockResolvedValue({
            user: { id: 1, username: 'admin1' },
            roles: ['admin'],
        });

        authService.generateToken.mockReturnValue('mocked-jwt-token');

        // Call the login controller
        await authController.login(mockReq, mockRes, next);

        // Assertions
        expect(authService.verifyCredentials).toHaveBeenCalledWith('password123', 'admin1');
        expect(authService.generateToken).toHaveBeenCalledWith(
            { id: 1, username: 'admin1' },
            ['admin']
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
            token: 'mocked-jwt-token',
            roles: ['admin'],
        });
    });

    it('should return 401 for invalid credentials', async () => {
        // Mock authService.verifyCredentials to throw an error
        authService.verifyCredentials.mockRejectedValue(new Error('Invalid username or password'));

        // Call the login controller
        await authController.login(mockReq, mockRes, next);

        // Assertions
        expect(authService.verifyCredentials).toHaveBeenCalledWith('admin1', 'password123');
        expect(authService.generateToken).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'Invalid username or password',
        });
    });

    it('should handle unexpected errors gracefully', async () => {
        // Mock authService.verifyCredentials to throw an unexpected error
        authService.verifyCredentials.mockRejectedValue(new Error('Unexpected error'));

        // Call the login controller
        await authController.login(mockReq, mockRes, next);

        // Assertions
        expect(authService.verifyCredentials).toHaveBeenCalledWith('admin1', 'password123');
        expect(authService.generateToken).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: 'Unexpected error',
        });
    });
});