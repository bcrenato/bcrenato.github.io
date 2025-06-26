// Configuração do Firebase (mesma configuração)
const firebaseConfig = {
    apiKey: "AIzaSyAm7J99HoC-_ccqqTL6ORSKe0mPCVebyH8",
    authDomain: "cadastro-firebase-22bb0.firebaseapp.com",
    databaseURL: "https://cadastro-firebase-22bb0-default-rtdb.firebaseio.com",
    projectId: "cadastro-firebase-22bb0",
    storageBucket: "cadastro-firebase-22bb0.firebasestorage.app",
    messagingSenderId: "476708455498",
    appId: "1:476708455498:web:7504f49d3e5829354f52b3"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const membersTable = document.getElementById('membersTable');
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const totalMembers = document.getElementById('totalMembers');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const memberModal = document.getElementById('memberModal');
    const closeMemberModal = document.getElementById('closeMemberModal');
    const memberDetails = document.getElementById('memberDetails');

    let allMembers = [];
    let currentPage = 1;
    const membersPerPage = 10;
    let filteredMembers = [];

    // Carregar membros do Firebase
    function loadMembers() {
        database.ref('membros').on('value', (snapshot) => {
            allMembers = [];
            snapshot.forEach((childSnapshot) => {
                const member = childSnapshot.val();
                member.id = childSnapshot.key;
                allMembers.push(member);
            });
            
            filterAndDisplayMembers();
        });
    }

    // Filtrar e exibir membros
    function filterAndDisplayMembers() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;
        
        filteredMembers = allMembers.filter(member => {
            const matchesSearch = member.personal.fullName.toLowerCase().includes(searchTerm) || 
                                member.personal.email.toLowerCase().includes(searchTerm) ||
                                member.personal.phone.includes(searchTerm);
            
            const matchesFilter = filterValue === 'all' || 
                                (member.personal.gender && member.personal.gender === filterValue);
            
            return matchesSearch && matchesFilter;
        });
        
        // Ordenar por data de cadastro (mais recente primeiro)
        filteredMembers.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
        
        totalMembers.textContent = `Total: ${filteredMembers.length} membros`;
        currentPage = 1;
        displayMembersPage();
    }

    // Exibir página atual de membros
    function displayMembersPage() {
        const startIndex = (currentPage - 1) * membersPerPage;
        const endIndex = startIndex + membersPerPage;
        const pageMembers = filteredMembers.slice(startIndex, endIndex);
        
        membersTable.innerHTML = '';
        
        if (pageMembers.length === 0) {
            membersTable.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                        Nenhum membro encontrado
                    </td>
                </tr>
            `;
        } else {
            pageMembers.forEach(member => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="font-medium text-gray-900">${member.personal.fullName}</div>
                        <div class="text-sm text-gray-500">${member.personal.gender === 'masculino' ? 'Masculino' : 'Feminino'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${member.personal.phone}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${member.personal.email}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${member.address.city}/${member.address.state}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${new Date(member.registrationDate).toLocaleDateString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button data-id="${member.id}" class="view-member text-indigo-600 hover:text-indigo-900 mr-3">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button data-id="${member.id}" class="delete-member text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                membersTable.appendChild(row);
            });
        }
        
        // Atualizar controles de paginação
        updatePaginationControls();
    }

    // Atualizar controles de paginação
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
        
        pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Mostrar detalhes do membro
    function showMemberDetails(memberId) {
        const member = allMembers.find(m => m.id === memberId);
        if (!member) return;
        
        document.getElementById('modalTitle').textContent = member.personal.fullName;
        
        // Formatando os ministérios
        const ministries = member.spiritual.ministry && member.spiritual.ministry.length > 0 
            ? member.spiritual.ministry.join(', ') 
            : 'Nenhum ministério selecionado';
        
        // Criando o HTML dos detalhes
        memberDetails.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-bold text-lg mb-3 text-indigo-600 border-b pb-2">
                        <i class="fas fa-user-circle mr-2"></i>Dados Pessoais
                    </h4>
                    <div class="space-y-2">
                        <p><strong>Nome Completo:</strong> ${member.personal.fullName}</p>
                        <p><strong>Data Nasc.:</strong> ${member.personal.birthDate ? new Date(member.personal.birthDate).toLocaleDateString() : 'Não informado'}</p>
                        <p><strong>CPF:</strong> ${member.personal.cpf || 'Não informado'}</p>
                        <p><strong>RG:</strong> ${member.personal.rg || 'Não informado'}</p>
                        <p><strong>Telefone:</strong> ${member.personal.phone}</p>
                        <p><strong>E-mail:</strong> ${member.personal.email}</p>
                        <p><strong>Estado Civil:</strong> ${formatMaritalStatus(member.personal.maritalStatus)}</p>
                        <p><strong>Gênero:</strong> ${member.personal.gender === 'masculino' ? 'Masculino' : 'Feminino'}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="font-bold text-lg mb-3 text-indigo-600 border-b pb-2">
                        <i class="fas fa-map-marker-alt mr-2"></i>Endereço
                    </h4>
                    <div class="space-y-2">
                        <p><strong>CEP:</strong> ${member.address.cep}</p>
                        <p><strong>Logradouro:</strong> ${member.address.street}, ${member.address.number}</p>
                        <p><strong>Complemento:</strong> ${member.address.complement || 'Não informado'}</p>
                        <p><strong>Bairro:</strong> ${member.address.neighborhood}</p>
                        <p><strong>Cidade/UF:</strong> ${member.address.city}/${member.address.state}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h4 class="font-bold text-lg mb-3 text-indigo-600 border-b pb-2">
                        <i class="fas fa-praying-hands mr-2"></i>Dados Espirituais
                    </h4>
                    <div class="space-y-2">
                        <p><strong>Data Batismo:</strong> ${member.spiritual.baptismDate ? new Date(member.spiritual.baptismDate).toLocaleDateString() : 'Não informado'}</p>
                        <p><strong>Igreja Batismo:</strong> ${member.spiritual.baptismChurch || 'Não informado'}</p>
                        <p><strong>Data Conversão:</strong> ${member.spiritual.conversionDate ? new Date(member.spiritual.conversionDate).toLocaleDateString() : 'Não informado'}</p>
                        <p><strong>Religião Anterior:</strong> ${member.spiritual.previousReligion || 'Não informado'}</p>
                        <p><strong>Ministérios:</strong> ${ministries}</p>
                        <p><strong>Dons Espirituais:</strong> ${member.spiritual.spiritualGifts || 'Não informado'}</p>
                        <div>
                            <strong>Testemunho:</strong>
                            <p class="mt-1 bg-white p-3 rounded border">${member.spiritual.testimony || 'Não informado'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        memberModal.classList.remove('hidden');
    }

    // Formatador de estado civil
    function formatMaritalStatus(status) {
        const statusMap = {
            'solteiro': 'Solteiro(a)',
            'casado': 'Casado(a)',
            'divorciado': 'Divorciado(a)',
            'viuvo': 'Viúvo(a)',
            'separado': 'Separado(a)'
        };
        return statusMap[status] || status;
    }

    // Deletar membro
    function deleteMember(memberId) {
        if (confirm('Tem certeza que deseja excluir este membro? Esta ação não pode ser desfeita.')) {
            database.ref('membros/' + memberId).remove()
                .then(() => {
                    alert('Membro excluído com sucesso!');
                })
                .catch(error => {
                    console.error('Erro ao excluir membro:', error);
                    alert('Ocorreu um erro ao excluir o membro.');
                });
        }
    }

    // Event listeners
    searchInput.addEventListener('input', filterAndDisplayMembers);
    filterSelect.addEventListener('change', filterAndDisplayMembers);
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayMembersPage();
        }
    });
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayMembersPage();
        }
    });
    closeMemberModal.addEventListener('click', () => {
        memberModal.classList.add('hidden');
    });
    
    // Delegated event listeners para os botões dinâmicos
    membersTable.addEventListener('click', (e) => {
        if (e.target.closest('.view-member')) {
            const memberId = e.target.closest('.view-member').getAttribute('data-id');
            showMemberDetails(memberId);
        }
        
        if (e.target.closest('.delete-member')) {
            const memberId = e.target.closest('.delete-member').getAttribute('data-id');
            deleteMember(memberId);
        }
    });

    // Carregar membros ao iniciar
    loadMembers();
});