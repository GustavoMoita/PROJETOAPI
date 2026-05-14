// Declarações dos Elementos usando DOM(Document Object Model)
const videoElemento = documento.getElementBydId("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

// Função assincrona para habilitar a câmero
async function configurarCamera(){
    // tratamento de erros
    try{
        // chama a api do navegador para solicitar acesso
        const midia= await navigator.mediaDevices.getUserMedia({
            // habilitar a câmera traseira 
            video:{ facingMode: "enviroment"},
            // o audio não será capturado
            audio: false
        })
        // recebe a função midia para ser executada
        videoElemento.scrObject=midia;
        // força a reprodução
        videoElemento.play();
    }catch(erro){
        resultado.innerText="Erro ao acessar a Câmera",erro;
    }
}

// executando a função
configurarCamera();

// função para configurar o texto da câmera
botaoScanear.onclick =async ()=>{
    botaoScanear.disabled=true; // habilitando a câmera
    resultado.innerText="Fazendo a leitura do texto...aguarde"

    // definindo o canvas para iniciar a leitura
    const contexto = canvas.getContext("2d")

    // ajusta o tamanho do canvas para o tamanho real do video
    canvas.width =videoElemento.videoWidth;
    canvas.height =videoElemento.videoHeigth;

    // aplica o filtron para melhorar o OCR
    contexto.filter='contrast(1.2) grayscale(1)';
    
    // desenha o video no canvas
    contexto.drawImage(videoElemento,0,0, canvas.width, canvas.height);
    try{
        const {data:{ texto }}=await Tesseract.recognize(
            canvas,
            'por' //define o idioma
        );
        // remove os espaços em branco
        const textoFinal = texto.trim();
        // estrutura condicional ternaria ? = if : = else 
        resultado.innerText=textoFinal.length > 0 ? textoFinal: "Não foi possível identificar o texto"

    }catch(erro){
        resultado.innerText="Erro no processamento",erro;
    }
    finally{
        // desabilita
        botaoScanear.disabled=false;

    }
}
