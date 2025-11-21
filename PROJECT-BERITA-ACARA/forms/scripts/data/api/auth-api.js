/**
 * Authentication API
 * Mock API untuk autentikasi dan manajemen user
 * TODO: Replace dengan actual API calls ke backend PHP
 */

class AuthAPI {
    constructor() {
        this.baseURL = '/api/auth';
        this.mockUsers = this.initializeMockUsers();
        this.currentUser = null;
    }

    /**
     * Initialize mock users
     */
    initializeMockUsers() {
        return [
            {
                id: 'vendor_001',
                email: 'vendor@example.com',
                password: 'password123', // In production, this would be hashed
                name: 'PT. Vendor Sukses',
                role: 'vendor',
                phone: '081234567890',
                address: 'Jakarta Selatan',
                createdAt: '2024-01-01T00:00:00'
            },
            {
                id: 'pic_001',
                email: 'pic@example.com',
                password: 'password123',
                name: 'Ahmad Wirawan',
                role: 'pic',
                phone: '081234567891',
                department: 'Gudang',
                createdAt: '2024-01-01T00:00:00'
            },
            {
                id: 'direksi_001',
                email: 'direksi@example.com',
                password: 'password123',
                name: 'Ir. Budi Santoso',
                role: 'direksi',
                phone: '081234567892',
                position: 'Direktur Operasional',
                createdAt: '2024-01-01T00:00:00'
            }
        ];
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            await this.simulateNetworkDelay();

            const user = this.mockUsers.find(u => u.email === email);

            if (!user) {
                throw new Error('Email tidak ditemukan');
            }

            if (user.password !== password) {
                throw new Error('Password salah');
            }

            // Generate mock token
            const token = this.generateToken(user.id);

            // Remove password from user object
            const { password: _, ...userWithoutPassword } = user;

            // Store in localStorage
            localStorage.setItem('userToken', token);
            localStorage.setItem('userId', user.id);
            localStorage.setItem('userRole', user.role);

            this.currentUser = userWithoutPassword;

            return {
                success: true,
                data: {
                    user: userWithoutPassword,
                    token
                },
                message: 'Login berhasil'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Register new user (vendor only for now)
     */
    async register(userData) {
        try {
            await this.simulateNetworkDelay();

            // Check if email already exists
            const existingUser = this.mockUsers.find(u => u.email === userData.email);
            if (existingUser) {
                throw new Error('Email sudah terdaftar');
            }

            const newUser = {
                id: `vendor_${Date.now()}`,
                ...userData,
                role: 'vendor',
                createdAt: new Date().toISOString()
            };

            this.mockUsers.push(newUser);

            // Remove password from response
            const { password: _, ...userWithoutPassword } = newUser;

            return {
                success: true,
                data: userWithoutPassword,
                message: 'Registrasi berhasil. Silakan login.'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await this.simulateNetworkDelay(200);

            // Clear localStorage
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');

            this.currentUser = null;

            return {
                success: true,
                message: 'Logout berhasil'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get current user
     */
    async getCurrentUser() {
        try {
            await this.simulateNetworkDelay(200);

            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User tidak terautentikasi');
            }

            const user = this.mockUsers.find(u => u.id === userId);
            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            const { password: _, ...userWithoutPassword } = user;
            this.currentUser = userWithoutPassword;

            return {
                success: true,
                data: userWithoutPassword
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, updateData) {
        try {
            await this.simulateNetworkDelay();

            const userIndex = this.mockUsers.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                throw new Error('User tidak ditemukan');
            }

            // Don't allow updating email or role
            const { email, role, password, ...safeUpdateData } = updateData;

            this.mockUsers[userIndex] = {
                ...this.mockUsers[userIndex],
                ...safeUpdateData,
                updatedAt: new Date().toISOString()
            };

            const { password: _, ...userWithoutPassword } = this.mockUsers[userIndex];

            return {
                success: true,
                data: userWithoutPassword,
                message: 'Profile berhasil diupdate'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Change password
     */
    async changePassword(userId, oldPassword, newPassword) {
        try {
            await this.simulateNetworkDelay();

            const user = this.mockUsers.find(u => u.id === userId);
            if (!user) {
                throw new Error('User tidak ditemukan');
            }

            if (user.password !== oldPassword) {
                throw new Error('Password lama salah');
            }

            if (newPassword.length < 8) {
                throw new Error('Password baru minimal 8 karakter');
            }

            const userIndex = this.mockUsers.findIndex(u => u.id === userId);
            this.mockUsers[userIndex].password = newPassword;

            return {
                success: true,
                message: 'Password berhasil diubah'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        const token = localStorage.getItem('userToken');
        return !!token;
    }

    /**
     * Get user role
     */
    getUserRole() {
        return localStorage.getItem('userRole');
    }

    /**
     * Generate mock token
     */
    generateToken(userId) {
        const timestamp = Date.now();
        return btoa(`${userId}:${timestamp}`);
    }

    /**
     * Simulate network delay
     */
    simulateNetworkDelay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create singleton instance
const authAPI = new AuthAPI();

// Export both class and instance
export { AuthAPI };
export default authAPI;