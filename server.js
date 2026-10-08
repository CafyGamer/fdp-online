// =============================================================
// F.D.P. ONLINE — Servidor WebSocket + HTTP
// =============================================================
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

// =============================================================
// CARTAS PRETAS (50)
// =============================================================
const BLACK_CARDS = [
  "Eu nunca fiquei tão irritado quanto quando descobri que ___.",
  "O verdadeiro motivo pelo qual eu fui demitido: ___.",
  "Nada supera a sensação de ___ depois de um dia longo.",
  "Meu terapeuta disse que preciso lidar com meu problema com ___.",
  "A pior coisa para se colocar em um currículo: ___.",
  "No meu epitáfio vai estar escrito: ___.",
  "O que realmente acontece na reunião de família: ___.",
  "Descobri que meu vizinho usa ___ para dormir melhor.",
  "O segredo do sucesso é ___.",
  "Se eu pudesse banir uma coisa do mundo, seria ___.",
  "Meu maior arrependimento de 2024 foi ___.",
  "A instrução que faltava no manual da vida: ___.",
  "Quando ninguém está olhando, eu ___.",
  "O novo reality show do momento: ___ no auge.",
  "Meu plano para dominar o mundo começa com ___.",
  "Na festa da firma, o que ninguém esperava era ___.",
  "O que me faz levantar da cama todos os dias: ___.",
  "Minha estratégia infalível para fugir de conversa chata: ___.",
  "O ingrediente secreto da vovó era ___.",
  "A verdadeira razão pela qual o casamento acabou: ___.",
  "Ninguém me avisou que ___ seria tão problemático.",
  "Aquele silêncio constrangedor só foi quebrado por ___.",
  "O pior presente que já recebi na vida: ___.",
  "Meu médico ficou preocupado quando mencionei ___.",
  "O título do meu memoir será: ___.",
  "A coisa mais brasileira que já vi: ___.",
  "O que eu grito quando perco no videogame: ___.",
  "Descobri tarde demais que ___ não se faz em público.",
  "A desculpa mais esfarrapada que já dei: ___.",
  "Meu superpoder secreto é ___.",
  "O que realmente rola no boteco às 2 da manhã: ___.",
  "A pior coisa que você pode falar pra sua mãe: ___.",
  "Meu histórico de pesquisa do Google está cheio de ___.",
  "Se arrependimento matasse, eu teria morrido por causa de ___.",
  "O que ninguém te conta sobre ser adulto: ___.",
  "A nova tendência do TikTok é ___.",
  "Meu grupo de amigos só se une por causa de ___.",
  "O crime perfeito envolve ___.",
  "A despedida ideal seria com ___.",
  "O que eu realmente quero dizer quando falo 'estou bem': ___.",
  "A pior coisa para se falar em um velório: ___.",
  "Meu maior talento escondido é ___.",
  "O motivo real pelo qual eu não respondi: ___.",
  "Aquela pessoa que todo mundo tem medo de virar: ___.",
  "O que eu faria se ganhasse na loteria: ___.",
  "A coisa que eu mais odeio no trânsito: ___.",
  "Meu plano B sempre foi ___.",
  "A saudade que eu sinto é de ___.",
  "O verdadeiro vilão da história é ___.",
  "O que ninguém deveria fazer bêbado: ___."
];

// =============================================================
// CARTAS BRANCAS (395)
// =============================================================
const WHITE_CARDS = [
  "Um pum silencioso e mortal.",
  "Chorar no chuveiro fingindo que é shampoo no olho.",
  "Mandar áudio de 7 minutos no grupo da família.",
  "Fingir que não vi a mensagem.",
  "Um brigadeiro de panela com gosto de arrependimento.",
  "Dormir 14 horas e ainda acordar cansado.",
  "Stalkear o ex às 3 da manhã.",
  "Comer pizza fria de café da manhã.",
  "Responder 'kkkk' sem rir de verdade.",
  "Um chinelo voando em direção ao inimigo.",
  "Cantar no chuveiro como se fosse final do The Voice.",
  "Soltar um 'ainda bem que não é comigo' bem alto.",
  "Usar a mesma roupa três dias seguidos.",
  "Um tabefe de luva branca na cara da sociedade.",
  "Falar 'estou a caminho' ainda de pijama.",
  "Ter 47 abas abertas no celular.",
  "Confessar tudo depois da terceira caipirinha.",
  "Mandar indireta no status do WhatsApp.",
  "Um pé de meia furado com orgulho.",
  "Rir da desgraça alheia em silêncio.","Dizer 'não sou eu, é você' e sair andando.",
"Um grupo de WhatsApp chamado 'Família Unida'.",
"Chorar assistindo comercial de margarina.",
"Sair correndo quando o porteiro grita seu nome.",
"Um look completo de pijama no mercado.",
"Falar mal da sogra e ela aparecer atrás de você.",
"Dar like em foto antiga por acidente.",
"Inventar uma desculpa e esquecer qual foi.",
"Comer escondido na madrugada.",
"Ter coragem de mandar 'oi, sumido'.",
"Fingir surpresa ao receber um presente que você pediu.",
"Mandar 'você mudou' para quem nunca foi nada.",
"Um abraço apertado que dura tempo demais.",
"Um 'boa noite' seguido de scroll de 3 horas.",
"Chorar de raiva e chamar de 'alergia'.",
"Fazer drama no grupo só pra chamar atenção.",
"Cantar parabéns sozinho porque ninguém apareceu.",
"Dar unfollow e depois voltar por curiosidade.",
"Fingir que acredita em horóscopo pra agradar a tia.",
"Um 'bom dia' enviado às 15h.",
"Sogra chegando sem avisar.",
"Tio bêbado contando história de quando era jovem.",
"Primo que ganha mais que você e faz questão de lembrar.",
"Família brigando por herança antes do velório terminar.",
"Churrasco de domingo que vira DR.",
"Mãe perguntando quando vem o neto.",
"Pai dizendo 'na minha época'.",
"Amigo que só aparece quando precisa de algo.",
"Date que fala só de si mesmo.",
"Ex que manda 'oi' às 2h da manhã.",
"Crush que responde visualiza e não responde.",
"Vó dizendo que você tá magro.",
"Cunhado que dá palpite em tudo.",
"Família postando foto do velório no Facebook.",
"Padrinho que sumiu após o batismo.",
"Comadre que sabe tudo da sua vida antes de você.",
"Irmão que come sua comida e nega.",
"Sobrinho pedindo dinheiro emprestado.",
"Namorada achando que você é o pai dela.",
"Briga por causa de herança de uma panela.",
"Marcar casamento e cancelar no dia.",
"Relacionamento à distância por 3 dias.",
"Romance de verão que dura 8 horas.",
"Pedido de desculpas que não é desculpa.",
"Amar e ser amado (só no Tinder).",
"Casar por causa do apartamento.",
"Terminar por mensagem de texto.",
"Sogra querendo morar com o casal.",
"Tia solteirona julgando todo mundo.",
"Filho que só liga pra pedir dinheiro.",
"Mãe que revisa o quarto sem pedir.",
"Pai que 'empresta' e nunca devolve.",
"Vó que fala mal de todo mundo em voz alta.",
"Prima que posta tudo da vida.",
"Família rica que trata você como empregado.",
"Família pobre que trata você como banco.",
"Reunião de família que termina em polícia.",
"Aquele parente que ninguém sabe de onde veio.",
"Aniversário onde todo mundo briga.",
"Natal onde só faltou a polícia.",
"Chefe que fala 'vamos alinhar' e não alinha nada.",
"Reunião que podia ter sido um e-mail.",
"Café ruim da firma.",
"Colega que rouba sua ideia na frente do chefe.",
"Estagiário que ganha mais que você.",
"Home office com roupa de baixo.",
"Prazo que era ontem.",
"Promoção que foi pro amigo do chefe.",
"Rir da piada ruim do chefe.",
"Fingir que tá trabalhando quando chefe chega.",
"Boleto chegando no fim do mês.",
"Salário que não cobre o aluguel.",
"Sexta-feira 17h59 e ainda chega demanda.",
"Feedback construtivo que só destrói.",
"Trabalhar 12h e receber 'você é família'.",
"Colega que fala alto no telefone.",
"Aquele que manda 'bom dia' com cobrança.",
"Domingo à noite com ansiedade de segunda.",
"Férias aprovadas e canceladas.",
"Crazy coworker que chora na mesa.",
"Crachá perdido na entrada.",
"Rodada de demissão surpresa.",
"Aplicar pra vaga que já tem dono.",
"Entrevista que só falta pedir currículo de novo.",
"Chefe que trata funcionário como filho.",
"Dizer 'só mais um minutinho' por 3 horas.",
"Fingir que gostou do presente de secret santa.",
"Cafezinho da firma com gosto de derrota.",
"Estudar a noite após 12h de trabalho.",
"Prova que caiu o que não estudou.",
"Professor que lê slide e chama de aula.",
"Colega de grupo que não faz nada.",
"Mestrado que virou depressão.",
"TCC entregue com 5 minutos de sobra.",
"Bolsista que trabalha como CLT.",
"Orientador que some por 3 meses.",
"Formatura que só dá dívida.",
"Diploma emoldurado e desemprego.",
"Pós-graduação que só serve pro currículo.",
"Vaga arrombada disfarçada de oportunidade.",
"Processo seletivo com 5 fases.",
"Carta de apresentação mentirosa.",
"LinkedIn cheio de coach.",
"RH que promete e não cumpre.",
"Chefe que não sabe usar o Excel.",
"Pastel de feira com gosto de óleo de motor.",
"Cachorro-quente de rua às 3h.",
"Pizza com borda recheada de arrependimento.",
"Feijoada que sobra até quarta.",
"Café com gosto de cigarro.",
"Brigadeiro de festa infantil.",
"Bolo de aniversário seco.",
"Sushi que era peixe ontem.",
"Comida japonesa de posto.",
"Marmita requentada no micro-ondas.",
"Sanduíche de pão velho.",
"Pão na chapa com manteiga e saudade.",
"Cerveja quente em churrasco.",
"Caipirinha com pinga de posto.",
"Whisky com gelo de torneira.",
"Vinho de 15 reais fingindo ser chileno.",
"Suco de caixinha com gosto de plástico.",
"Água do bebedouro da firma.",
"Refrigerante sem gás.",
"Churrasco vegano.",
"Feijão com farinha e vergonha.",
"Cuscuz no café da manhã.",
"Tapioca com recheio de mentira.",
"Açaí com 20 acompanhamentos.",
"Coxinha de padaria com catupiry falso.",
"Esfiha de carne com gosto de soja.",
"Kibe cru por fora, cru por dentro.",
"Hambúrguer artesanal de 60 reais.",
"Comida de restaurante que cobra pra respirar.",
"Risoto que veio empapado.",
"Sopa que virou creme.",
"Macarrão instantâneo requentado.",
"Lasanha congelada de domingo.",
"Ovo mexido com gosto de sal.",
"Tapioca sem recheio e sem sal.",
"Salada que a folha já tava murcha.",
"Pão de queijo de saquinho.",
"Pipoca queimada no cinema.",
"Chocolate amargo demais.",
"Sorvete de flocos com gosto de areia.",
"TikTok às 3h da manhã.",
"Influencer vendendo curso de como ser influencer.",
"Live de 8 horas jogando.",
"Print enviado pro grupo errado.",
"Áudio de 10 minutos que podia ser 'ok'.",
"Meme antigo que te faz rir até hoje.",
"Perfil fake do ex.",
"Cancelamento no Twitter.",
"Grupo da família compartilhando fake news.",
"Tia mandando bom dia com imagem de flor.",
"Pai digitando com um dedo.",
"Mãe mandando vídeo de 20 min.",
"Netflix e chill (só chill).",
"Spoiler sem aviso.",
"Filme que promete e não entrega.",
"Série que cancelam no melhor momento.",
"Reality show que ninguém admite assistir.",
"Final de novela decepcionante.",
"BBB com 20 participantes e 0 carisma.",
"Funk proibidão no churrasco.",
"Sertanejo universitário sobre chifre.",
"Pagode de mesa de bar.",
"Show que você pagou caro e nem viu.",
"Ingresso comprado e não usado.",
"Grupo de fãs brigando entre si.",
"Fandom tóxico.",
"Cosplay malfeito.",
"Anime com final aberto.",
"Mangá que virou live-action ruim.",
"Jogo com pay-to-win.",
"Loot box com probabilidade de 0,01%.",
"Bug que destrói o save.",
"Update que quebra tudo.",
"Servidor caindo no lançamento.",
"Streamer gritando por doação.",
"Discord cheio de estranho.",
"Reddit em português que só tem print.",
"X/Twitter e sua comunidade saudável.",
"Instagram com filtro e sem alma.",
"Facebook de gente velha.",
"WhatsApp Web desconectado na hora errada.",
"Notebook com 2 GB de RAM.",
"Celular com tela trincada há 3 anos.",
"Wi-Fi caindo na hora do Pix.",
"Bateria que acaba em 15 min.",
"Fone que só funciona de um lado.",
"Ônibus lotado às 6h da manhã.",
"Metrô com greve surpresa.",
"Uber cancelando na sua cara.",
"Motoboy com delivery na chuva.",
"Semáforo que nunca abre.",
"Buraco na rua que engole carro.",
"Enchente em dia de trabalho.",
"Calor de 40 graus sem ar-condicionado.",
"Frio de 10 graus e todo mundo de casaco.",
"Chuva que alaga tudo em 5 min.",
"Praia lotada no feriado.",
"Fila do SUS que dura 8 horas.",
"Posto de saúde sem médico.",
"Farmácia com fila até a calçada.",
"Banco com 3 caixas e 200 pessoas.",
  "Boleto com vencimento ontem.",
  "Cartão clonado no posto.",
  "Celular roubado na saída do show.",
  "Assalto a mão armada no farol.",
  "Polícia que chega depois.",
  "Viatura sem gasolina.",
  "Prefeito inaugurando obra inacabada.",
  "Político discursando em inauguração.",
  "Eleição com 30 candidatos.",
  "Horário político na TV.",
  "Propina disfarçada de emenda.",
  "Câmara votando às 3h da manhã.",
  "Senador com carro oficial.",
  "Auxílio que não chega.",
  "Bolsa que só cobre o básico.",
  "Cesta básica com 3 itens.",
  "Mercado com preço que muda entre a gôndola e o caixa.",
  "Feira com desconto só se chorar.",
  "Padeiro que cobra mais caro pelo pão de ontem.",
  "Padaria com fila às 7h.",
  "Lotérica com fila pra apostar na Mega.",
  "Aposta que ia dar certo e não deu.",
  "Mega acumulada de R$ 200 milhões.",
  "Raspadinha premiada em R$ 5.",
  "Bingo da igreja no sábado.",
  "Um boquete mal executado.",
  "Sexo com meia ainda no pé.",
  "Broxada na hora H.",
  "Gozar rápido e fingir que foi intenso.",
  "Falar o nome errado na cama.",
  "Peido durante o sexo.",
  "Rir na hora errada.",
  "Cheiro de suor depois do sexo.",
  "Camisinha que estoura.",
  "Pilula do dia seguinte na segunda.",
  "Teste de gravidez positivo.",
  "Exame de DST no posto.",
  "Virgindade perdida por pressão.",
  "Primeira vez decepcionante.",
  "Fantasia sexual mal explicada.",
  "Fetiche estranho revelado no terceiro encontro.",
  "Ménage que deu errado.",
  "Casamento aberto que só abre pra um lado.",
  "Corno manso assumido.",
  "Traição descoberta por print.",
  "Amante que aparece na festa da firma.",
  "Sexo no carro e o vidro embaçado.",
  "Motel com espelho no teto.",
  "Sexo no banheiro da festa.",
  "Chupão no pescoço escondido na segunda.",
  "HPV que ninguém admite ter.",
  "Consulta no urologista.",
  "Exame de próstata aos 40.",
  "Menopausa e calorão.",
  "TPM que dura 15 dias.",
  "Cólica que derruba.",
  "Sutiã que machuca.",
  "Cueca furada por baixo da calça.",
  "Pelos que ninguém sabe por que existem.",
  "Unha encravada que dói pra andar.",
  "Barriga que só aparece na foto.",
  "Celulite que ninguém vê.",
  "Estria que conta história.",
  "Cicatriz que você inventa história pra contar.",
  "Tatuagem que você se arrepende.",
  "Sentido da vida que ninguém achou.",
  "Filosofia de mesa de bar às 4h.",
  "Chorar vendo o pôr do sol.",
  "Questionar por que a gente existe.",
  "Ter crise existencial no banho.",
  "Pensar em largar tudo e virar hippie.",
  "Medo de morrer sozinho.",
  "Aceitar que ninguém entende nada.",
  "Fingir que tem plano de vida.",
  "Inventar propósito pra justificar segunda-feira.",
  "Rezar sem acreditar muito.",
  "Ter fé que amanhã melhora.",
  "Esperança que teima em existir.",
  "Saudade de quem nem foi embora.",
  "Melancolia de domingo à noite.",
  "Aquela vontade de sumir por 3 dias.",
  "Vontade de mandar tudo à merda.",
  "Chorar no banho ouvindo música triste.",
  "Depressão de segunda de manhã.",
  "Ansiedade às 2h da manhã.",
  "Terapia que você só finge que faz.",
  "Remédio que você esquece de tomar.",
  "Autoajuda que não ajuda.",
  "Coach dizendo 'você pode mais'.",
  "Motivação que dura 3 dias.",
  "Metas de ano novo em janeiro.",
  "Dieta que acaba no primeiro fim de semana.",
  "Academia que você paga e não vai.",
  "Meditação de 5 min que parece 5h.",
  "Ioga em casa sem sair do sofá.",
  "Journaling que virou diário de reclamação.",
  "Silêncio que diz tudo.",
  "Aquele olhar de julgamento.",
  "Conselho que ninguém pediu.",
  "Crítica que você fingiu não ouvir.",
  "Verdade que dói mais que mentira.",
  "Mentira branca que virou bola de neve.",
  "Segredo que você levará pro túmulo.",
  "Culpa que você carrega há anos.",
  "Perdão que você não deu nem pra você mesmo.",
  "Um cadáver no porta-malas (calma, é brincadeira).",
  "Satanás usando chinelo de dedo.",
  "Jesus de skate no Viaduto do Chá.",
  "Papai Noel em greve.",
  "Coelhinho da Páscoa vendendo ovo de chocolate falsificado.",
  "Fada do dente cobrando taxa.",
  "Criança possuída pelo demônio.",
  "Exorcismo ao vivo no YouTube.",
  "Pastor cobrando dízimo em Pix.",
  "Igreja com catraca na entrada.",
  "Culto de 4 horas no domingo.",
  "Terço rezado em 30 segundos.",
  "Sacerdote usando TikTok.",
  "Monge tibetano em festa rave.",
  "Hare Krishna no farol.",
  "Testemunha de Jeová às 8h de sábado.",
  "Mórmon de bicicleta.",
  "Cigano cobrando consulta.",
  "Cartomante no grupo da família.",
  "Horóscopo dizendo que ia dar certo e deu errado.",
  "Signo inventado no horóscopo chinês.",
  "Vidente que não viu o golpe vindo.",
  "Extraterrestre fazendo exame de próstata.",
  "Abdução no meio do churrasco.",
  "OVNI filmado com péssima qualidade.",
  "Fantasma assombrando condomínio.",
  "Loira do banheiro dando autógrafo.",
  "Saci-Pererê de tênis da Nike.",
  "Curupira de terno.",
  "Iara usando biquíni de crochê.",
  "Boto cor-de-rosa pai de família.",
  "Mula sem cabeça com placa de 'não perturbe'.",
  "Lobisomem peludo com depilação marcada.",
  "Vampiro vegano.",
  "Zumbi em manifestação por direitos.",
  "Múmia com dor nas costas.",
  "Bruxa no grupo de mães do WhatsApp.",
  "Dragão de estimação com coleira.",
  "Unicórnio hétero top.",
  "Papagaio que fala palavrão.",
  "Cachorro que late pro vizinho.",
  "Gato que te julga do nada.",
  "Hamster com crise existencial.",
  "Peixe beta suicida.",
  "Tartaruga que corre atrás de meta.",
  "Pombo que caga no carro lavado.",
  "Barata voando na sua cara.",
  "Rato no metrô lotado.",
  "Periquito solto na sala.",
  "Papagaio imitando o chefe.",
  "Galinha atropelando moto.",
  "Vaca na estrada.",
  "Boi no meio da avenida.",
  "Onça no quintal.",
  "Jacaré na piscina.",
  "Capivara atravessando a rua.",
  "Mico-leão-dourado em Brasília.",
  "Urubu na janela.",
  "Coruja na árvore do condomínio."
];
// =============================================================
// UTILITÁRIOS
// =============================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// =============================================================
// ESTADO DAS SALAS
// =============================================================
const rooms = {};

function makeRoom(code, targetScore) {
  return {
    code: code,
    targetScore: targetScore,
    phase: 'lobby',
    players: [],
    judgeIndex: 0,
    round: 0,
    blackCard: null,
    blackDeck: shuffle(BLACK_CARDS),
    whiteDeck: shuffle(WHITE_CARDS),
    submissions: [],
    lastWinner: null
  };
}

function drawWhite(room, n) {
  const picked = [];
  for (let i = 0; i < n; i++) {
    if (room.whiteDeck.length === 0) room.whiteDeck = shuffle(WHITE_CARDS);
    picked.push(room.whiteDeck.shift());
  }
  return picked;
}

function findPlayer(room, id) {
  return room.players.find(p => p.id === id);
}

function findPlayerByName(room, name) {
  return room.players.find(p => p.name.toLowerCase() === name.toLowerCase());
}

function publicState(room) {
  return {
    type: 'STATE',
    code: room.code,
    phase: room.phase,
    round: room.round,
    blackCard: room.blackCard,
    judgeId: room.players[room.judgeIndex] ? room.players[room.judgeIndex].id : null,
    judgeName: room.players[room.judgeIndex] ? room.players[room.judgeIndex].name : null,
    players: room.players.map(p => ({
      id: p.id,
      name: p.name,
      score: p.score,
      connected: p.connected,
      handCount: p.hand.length
    })),
    submissions: room.submissions.map(s => ({
      playerId: s.playerId,
      card: (room.phase === 'result' || room.phase === 'gameover') ? s.card : null
    })),
    lastWinner: room.lastWinner,
    targetScore: room.targetScore
  };
}function broadcast(room, message) {
  const msg = JSON.stringify(message);
  room.players.forEach(p => {
    if (p.connected && p.ws.readyState === 1) p.ws.send(msg);
  });
}

function sendTo(player, message) {
  if (player && player.connected && player.ws.readyState === 1) {
    player.ws.send(JSON.stringify(message));
  }
}

function broadcastState(room) {
  broadcast(room, publicState(room));
  room.players.forEach(p => sendTo(p, { type: 'HAND', hand: p.hand }));
}

// =============================================================
// LÓGICA DO JOGO
// =============================================================
function startRound(room) {
  room.phase = 'playing';
  room.round++;
  room.submissions = [];
  room.lastWinner = null;

  if (room.blackDeck.length === 0) room.blackDeck = shuffle(BLACK_CARDS);
  room.blackCard = room.blackDeck.shift();

  room.players.forEach(p => {
    const need = 7 - p.hand.length;
    if (need > 0) p.hand.push.apply(p.hand, drawWhite(room, need));
  });
}

function pickWinner(room, winnerPlayerId) {
  const winner = findPlayer(room, winnerPlayerId);
  if (!winner) return;
  winner.score++;
  const sub = room.submissions.find(s => s.playerId === winnerPlayerId);
  room.lastWinner = { playerId: winner.id, name: winner.name, card: sub ? sub.card : '' };
  if (winner.score >= room.targetScore) {
    room.phase = 'gameover';
  } else {
    room.phase = 'result';
  }
}

function nextRound(room) {
  room.judgeIndex = (room.judgeIndex + 1) % room.players.length;
  startRound(room);
}