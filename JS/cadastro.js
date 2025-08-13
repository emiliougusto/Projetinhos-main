function cadastrarUsuario(event) {

    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmar-senha').value;
    const aceitouTermos = document.getElementById('termos').checked;


    if (!nome || !sobrenome || !email || !senha) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return false;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não conferem!');
        return false;
    }

    if (!aceitouTermos) {
        alert('Você deve aceitar os termos de uso!');
        return false;
    }


    console.log('Dados do usuário:', {
        nome,
        sobrenome,
        email,
        telefone,
        senha
    });

    alert('Cadastro realizado com sucesso!');

    window.location.href = './index.html';

    return false;
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId === 'senha' ? 'toggleIconSenha' : 'toggleIconConfirmar');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('cadastroForm');
    if (form) {
        form.addEventListener('submit', cadastrarUsuario);
    }
});