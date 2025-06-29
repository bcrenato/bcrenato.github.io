// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBC73aRe7HLp-zQNpJcbWLlUj24kiQGAcE",
  authDomain: "cadastro-membros-c5cd4.firebaseapp.com",
  databaseURL: "https://cadastro-membros-c5cd4-default-rtdb.firebaseio.com",
  projectId: "cadastro-membros-c5cd4",
  storageBucket: "cadastro-membros-c5cd4.firebasestorage.app",
  messagingSenderId: "250346042791",
  appId: "1:250346042791:web:6bc469b844de69e526b282"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    // Form steps navigation
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const stepContents = document.querySelectorAll('.step-content');
    const steps = document.querySelectorAll('.step');
    const progressBar = document.querySelector('.step-progress');
    
    let currentStep = 1;
    const totalSteps = 3;
    
    // Next step
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                currentStep++;
                updateForm();
            }
        });
    });
    
    // Previous step
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentStep--;
            updateForm();
        });
    });
    
    // Update form display
    function updateForm() {
        // Hide all steps
        stepContents.forEach(content => {
            content.classList.add('hidden');
        });
        
        // Show current step
        document.querySelector(`.step-content[data-step="${currentStep}"]`).classList.remove('hidden');
        
        // Update progress steps
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('active');
                step.querySelector('div').classList.remove('bg-gray-200', 'text-gray-600');
                step.querySelector('div').classList.add('bg-indigo-600', 'text-white');
                step.querySelector('span').classList.remove('text-gray-500');
                step.querySelector('span').classList.add('text-indigo-600');
            } else {
                step.classList.remove('active');
                step.querySelector('div').classList.add('bg-gray-200', 'text-gray-600');
                step.querySelector('div').classList.remove('bg-indigo-600', 'text-white');
                step.querySelector('span').classList.add('text-gray-500');
                step.querySelector('span').classList.remove('text-indigo-600');
            }
        });
        
        // Update progress bar
        const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    // Validate step before proceeding
    function validateStep(step) {
        let isValid = true;
        const currentStepContent = document.querySelector(`.step-content[data-step="${step}"]`);
        
        // Check required fields in current step
        const requiredInputs = currentStepContent.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('border-red-500');
                input.classList.remove('border-gray-300');
                isValid = false;
                
                // Add error message if not exists
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const error = document.createElement('p');
                    error.className = 'error-message text-red-500 text-xs mt-1';
                    error.textContent = 'Este campo é obrigatório';
                    input.parentNode.insertBefore(error, input.nextSibling);
                }
            } else {
                input.classList.remove('border-red-500');
                input.classList.add('border-gray-300');
                
                // Remove error message if exists
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                    input.nextElementSibling.remove();
                }
            }
        });
        
        // Validate email format if email field exists
        const emailInput = currentStepContent.querySelector('input[type="email"]');
        if (emailInput && emailInput.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.classList.add('border-red-500');
                emailInput.classList.remove('border-gray-300');
                isValid = false;
                
                if (!emailInput.nextElementSibling || !emailInput.nextElementSibling.classList.contains('error-message')) {
                    const error = document.createElement('p');
                    error.className = 'error-message text-red-500 text-xs mt-1';
                    error.textContent = 'Por favor, insira um e-mail válido';
                    emailInput.parentNode.insertBefore(error, emailInput.nextSibling);
                }
            }
        }
        
        return isValid;
    }
    
    // Form submission
    const form = document.getElementById('memberForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateStep(currentStep)) {
            // Coletar todos os dados do formulário
            const formData = {
                personal: {
                    fullName: document.getElementById('fullName').value.trim(),
                    birthDate: document.getElementById('birthDate').value,
                    cpf: document.getElementById('cpf').value.trim(),
                    rg: document.getElementById('rg').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    maritalStatus: document.querySelector('select[name="maritalStatus"]').value,
                    gender: document.querySelector('input[name="gender"]:checked')?.value
                },
                address: {
                    cep: document.getElementById('cep').value.trim(),
                    street: document.getElementById('street').value.trim(),
                    number: document.getElementById('number').value.trim(),
                    complement: document.getElementById('complement').value.trim(),
                    neighborhood: document.getElementById('neighborhood').value.trim(),
                    city: document.getElementById('city').value.trim(),
                    state: document.getElementById('state').value
                },
                spiritual: {
                    baptismDate: document.getElementById('baptismDate').value,
                    baptismChurch: document.getElementById('baptismChurch').value.trim(),
                    conversionDate: document.getElementById('conversionDate').value,
                    previousReligion: document.getElementById('previousReligion').value.trim(),
                    ministry: Array.from(document.querySelectorAll('input[name="ministry"]:checked')).map(el => el.value),
                    spiritualGifts: document.getElementById('spiritualGifts').value.trim(),
                    testimony: document.getElementById('testimony').value.trim()
                },
                registrationDate: new Date().toISOString()
            };

            // Enviar para o Firebase
            const ref = database.ref('cadmembros').push();
            ref.set(formData)
                .then(() => {
                    // Show success modal
                    document.getElementById('successModal').classList.remove('hidden');
                    form.reset();
                    currentStep = 1;
                    updateForm();
                })
                .catch((error) => {
                    console.error("Erro ao cadastrar:", error);
                    alert("Ocorreu um erro ao cadastrar. Por favor, tente novamente.");
                });
        }
    });
    
    // Close modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('successModal').classList.add('hidden');
    });
    
    // CEP search functionality
    document.getElementById('searchCep').addEventListener('click', function() {
        const cepInput = document.getElementById('cep');
        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            alert('CEP inválido. Por favor, insira um CEP com 8 dígitos.');
            return;
        }
        
        // Show loading
        this.innerHTML = '<i class="fas fa-spinner animate-spin mr-1"></i> Buscando...';
        this.disabled = true;
        
        // Fazer requisição para a API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    throw new Error('CEP não encontrado');
                }
                
                // Preencher os campos
                document.getElementById('street').value = data.logradouro || '';
                document.getElementById('neighborhood').value = data.bairro || '';
                document.getElementById('city').value = data.localidade || '';
                document.getElementById('state').value = data.uf || '';
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
                alert('CEP não encontrado. Por favor, preencha os dados manualmente.');
            })
            .finally(() => {
                // Reset button
                this.innerHTML = '<i class="fas fa-search mr-1"></i> Buscar';
                this.disabled = false;
            });
    });
    
    // Input masks
    // CPF mask
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });
    
    // RG mask
    document.getElementById('rg').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{2})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1})$/, '$1-$2');
        e.target.value = value;
    });
    
    // Phone mask
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
    });
    
    // CEP mask
    document.getElementById('cep').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });
});
