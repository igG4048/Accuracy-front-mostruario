<!DOCTYPE html>
<html lang="pt-BR">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Cadastro - InvestFlow</title>

    <link rel="stylesheet" href="css/cadastro.css">

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

</head>

<body>

<div class="container">

    <aside class="sidebar">

        <div class="logo">

            <div class="logo-icon">

            </div>

            <span>Accuracy</span>

        </div>

        <div class="timeline">

            <div class="item active">

                <div class="circle">1</div>

                <div>

                    <h3>Crie sua conta</h3>

                    <p>
                        Preencha seus dados básicos
                        para começar
                    </p>

                </div>

            </div>

            <div class="line"></div>

            <div class="item">

                <div class="circle">2</div>

                <div>

                    <h3>Confirme seu e-mail</h3>

                    <p>
                        Vamos verificar seu endereço
                        de e-mail
                    </p>

                </div>

            </div>

            <div class="line"></div>

            <div class="item">

                <div class="circle">3</div>

                <div>

                    <h3>Monte sua carteira</h3>

                    <p>
                        Adicione seus ativos e comece
                        a acompanhar
                    </p>

                </div>

            </div>

        </div>

    </aside>

    <main class="content">

        <form class="register" method="POST" action="cadastro.php">

            <h1>Criar conta gratuita</h1>

            <span class="subtitle">
                Leva menos de 2 minutos para começar
            </span>

            <div class="field">
                <label for="nome">Nome Completo</label>
                <input type="text" id="nome" name="nomeCadastro" placeholder="João da Silva">
            </div>

            <div class="field">
                <label for="email">E-mail</label>
                <input type="email" id="email" name="emailCadastro" placeholder="seu@email.com">
            </div>

            <div class="row">

                <div class="field">
                    <label for="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        name="senhaCadastro"
                        placeholder="Mín. 8 caracteres">
                </div>

                <div class="field">
                    <label for="telefone">Telefone</label>
                    <input
                        type="text"
                        id="telefone"
                        name="telefoneCadastro"
                        placeholder="(11) 98765-4321"
                        inputmode="numeric"
                        maxlength="15">
                </div>

            </div>

            <div class="field">
                <label for="cpf">CPF</label>
                <input
                    type="text"
                    id="cpf"
                    name="cpfCadastro"
                    placeholder="000.000.000-00"
                    inputmode="numeric"
                    maxlength="14">
            </div>

            <label class="check">

                <input type="checkbox">

                <span>

                    Concordo com os

                    <a href="#">Termos de Uso</a>

                    e a

                    <a href="#">Política de Privacidade</a>

                </span>

            </label>

            <button type="submit" name="btnCadastro">

                Criar minha conta

            </button>

            <p class="login">

                Já tem conta?

                <a href="login.html">Entrar</a>

            </p>

        </form>

    </main>

</div>

<script>

    /* =========================
       MÁSCARA DE TELEFONE
       (11) 98765-4321  ou  (11) 8765-4321
    ========================= */

    function mascaraTelefone(valor) {

        const n = valor.replace(/\D/g, "").slice(0, 11);

        if (n.length === 0) return "";
        if (n.length <= 2)  return `(${n}`;
        if (n.length <= 6)  return `(${n.slice(0, 2)}) ${n.slice(2)}`;
        if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;

        return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
    }


    /* =========================
       MÁSCARA DE CPF
       123.456.789-01
    ========================= */

    function mascaraCpf(valor) {

        const n = valor.replace(/\D/g, "").slice(0, 11);

        return n
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2");
    }


    document.getElementById("telefone").addEventListener("input", function (e) {
        e.target.value = mascaraTelefone(e.target.value);
    });

    document.getElementById("cpf").addEventListener("input", function (e) {
        e.target.value = mascaraCpf(e.target.value);
    });

</script>

</body>
</html>