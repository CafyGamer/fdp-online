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
  "Rir da desgraça alheia em silêncio.",