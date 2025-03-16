document.getElementById('sorteioForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Obtém os valores do formulário
    const min = document.getElementById('min').value;
    const max = document.getElementById('max').value;
    const quantidade = document.getElementById('quantidade').value;
    const jogos = document.getElementById('jogos').value;

    // Validações no frontend
    const minNum = parseInt(min, 10);
    const maxNum = parseInt(max, 10);
    const quantidadeNum = parseInt(quantidade, 10);
    const jogosNum = parseInt(jogos, 10);

    if (minNum >= maxNum) {
        alert('O valor mínimo deve ser menor que o valor máximo.');
        return;
    }

    if (quantidadeNum > (maxNum - minNum + 1)) {
        alert('A quantidade de números a sortear não pode ser maior que o intervalo.');
        return;
    }

    // Envia os dados para o backend
    const response = await fetch('/sortear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ min, max, quantidade, jogos }),
    });

    const data = await response.json();

    // Formata os resultados com os ícones de trevo
    const resultadosFormatados = data.jogos.map(jogo => `🍀 ${jogo.join(', ')} 🍀`);

    // Exibe os resultados
    document.getElementById('resultado').innerHTML = resultadosFormatados.join('<br>');

    // Limpa o formulário após o sorteio
    document.getElementById('sorteioForm').reset();
});

document.getElementById('exportarPDF').addEventListener('click', function () {
    const resultado = document.getElementById('resultado').innerText;

    // Verifica se há resultados para exportar
    if (!resultado.trim()) {
        alert('Nenhum resultado para exportar.');
        return;
    }

    // Remove os trevos dos resultados
    const resultadosLimpos = resultado.split('\n').map(linha => {
        return linha.replace(/🍀/g, '').trim(); // Remove os trevos e espaços extras
    });

    // Cria um novo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações do PDF
    doc.setFontSize(12);
    doc.text('Resultados Sorteados:', 10, 10);
    doc.setFontSize(10);

    // Adiciona os resultados ao PDF
    resultadosLimpos.forEach((linha, index) => {
        doc.text(linha, 10, 20 + (index * 10));
    });

    // Salva o PDF
    doc.save('resultados.pdf');
});