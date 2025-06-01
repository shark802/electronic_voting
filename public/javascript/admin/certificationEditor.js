class CertificationEditor {
    constructor() {
        this.form = document.getElementById('certificationForm');
        this.notedByContainer = document.getElementById('notedByContainer');
        this.certificationDetails = null;
        this.init();
    }

    async init() {
        try {
            // Show loading state
            this.showLoading();

            await this.fetchCertificationDetails();
            this.renderForm();
            this.setupEventListeners();

            // Hide loading state
            this.hideLoading();
        } catch (error) {
            console.error('Error initializing certification editor:', error);
            this.hideLoading();
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to load certification details. Please try refreshing the page.',
                confirmButtonColor: '#3085d6'
            });
        }
    }

    showLoading() {
        // Disable form inputs
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => input.disabled = true);

        // Show loading spinner
        const submitButton = this.form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
        `;
    }

    hideLoading() {
        // Enable form inputs
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => input.disabled = false);

        // Restore submit button
        const submitButton = this.form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.innerHTML = 'Save Changes';
    }

    async fetchCertificationDetails() {
        try {
            const response = await fetch('/api/certification');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch certification details');
            }
            this.certificationDetails = await response.json();
        } catch (error) {
            console.error('Error fetching certification details:', error);
            throw error;
        }
    }

    renderForm() {
        if (!this.certificationDetails) return;

        // Render Prepared By section
        document.querySelector('[name="preparedBy.name"]').value = this.certificationDetails.preparedBy.name || '';
        document.querySelector('[name="preparedBy.position"]').value = this.certificationDetails.preparedBy.position || '';

        // Render Noted By section
        this.notedByContainer.innerHTML = this.certificationDetails.notedBy.map((person, index) => `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Name ${index + 1}:</label>
                    <input type="text" name="notedBy[${index}].name" value="${person.name || ''}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Position ${index + 1}:</label>
                    <input type="text" name="notedBy[${index}].position" value="${person.position || ''}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>
        `).join('');

        // Render Approved By section
        document.querySelector('[name="approvedBy.name"]').value = this.certificationDetails.approvedBy.name || '';
        document.querySelector('[name="approvedBy.position"]').value = this.certificationDetails.approvedBy.position || '';
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();

        try {
            this.showLoading();

            const formData = new FormData(e.target);
            const certificationDetails = {
                preparedBy: {
                    name: formData.get('preparedBy.name'),
                    position: formData.get('preparedBy.position')
                },
                notedBy: Array.from({ length: 5 }, (_, i) => ({
                    name: formData.get(`notedBy[${i}].name`),
                    position: formData.get(`notedBy[${i}].position`)
                })),
                approvedBy: {
                    name: formData.get('approvedBy.name'),
                    position: formData.get('approvedBy.position')
                }
            };

            const response = await fetch('/api/certification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ certificationDetails })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save certification details');
            }

            // Show success message
            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Certification details saved successfully',
                showConfirmButton: false,
                timer: 1500
            });

            // Redirect after success
            window.location.href = '/admin/election/result/' + document.getElementById('electionId').value;
        } catch (error) {
            console.error('Error:', error);
            this.hideLoading();

            // Show error message
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Error saving certification details',
                confirmButtonColor: '#3085d6'
            });
        }
    }
}

// Initialize the editor when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CertificationEditor();
}); 