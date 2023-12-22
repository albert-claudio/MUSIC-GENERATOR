// Importando o cliente Gradio
import { client } from "@gradio/client";

async function run() {
    // Inicializando o cliente Gradio
    const app = await client("https://facebook-musicgen.hf.space/");

    // Obtendo referências para os elementos HTML
    const loadingMessage = document.getElementById("loading");
    const generatedAudio = document.getElementById("generated-audio");
    const generateButton = document.getElementById("generate");
    const fileInput = document.getElementById("audio-file"); // Adicionado para permitir o upload de arquivos
    const userPrompt = document.getElementById("user-prompt"); // Adicionado para obter o prompt do usuário

    // Adicionando um ouvinte de evento ao botão de geração
    generateButton.addEventListener('click', async () => {
        // Desativando o botão de geração e exibindo a mensagem de carregamento
        generateButton.disabled = true;
        loadingMessage.style.display = "block";

        try {
            // Verificando se um arquivo foi carregado
            let exampleAudio;
            if (fileInput.files.length > 0) {
                exampleAudio = fileInput.files[0];
            }

            // Fazendo a previsão usando o cliente Gradio
            const result = await app.predict(1, [
                exampleAudio ? "file" : userPrompt.value, // string no componente 'Condition on a melody (optional) File or Mic'
            ]);

            // Registrando a resposta
            console.log(result?.data);

            // Adicionando lógica para exibir o áudio gerado
            const audioUrl = result?.data[0]; // Ajuste conforme a estrutura da resposta
            if (audioUrl) {
                generatedAudio.src = audioUrl;
                generatedAudio.style.display = "block";
            } else {
                console.error("URL de áudio não disponível na resposta.");
            }

        } catch (error) {
            // Tratando o erro
            console.error("Erro ao gerar música:", error);
        } finally {
            // Reativando o botão de geração e ocultando a mensagem de carregamento
            generateButton.disabled = false;
            loadingMessage.style.display = "none";
        }
    });
}

// Executando a função
run();
