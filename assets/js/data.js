(function () {
  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ===== QUIZ BANKS =====
  // { q, options[4], answer, explain } -> explain deve trazer justificativa com base em diretrizes (AHA/ILCOR/ERC/NRP/OMS)
  const BLS = [
    { q: "Frequência das compressões no adulto?", options: ["60–80", "80–100", "100–120", "140–160"], answer: 2,
      explain: "Diretrizes internacionais (AHA/ILCOR/ERC) recomendam 100–120 compressões/min para melhor perfusão durante a RCP." },
    { q: "Profundidade da compressão no adulto?", options: ["2 cm", "3 cm", "5–6 cm", "8 cm"], answer: 2,
      explain: "Recomendação típica (AHA/ILCOR/ERC): 5–6 cm no adulto, com recuo completo, para gerar débito circulatório adequado." },
    { q: "Relação compressão/ventilação no adulto (1 socorrista)?", options: ["15:2", "30:2", "20:2", "10:2"], answer: 1,
      explain: "Em BLS adulto: 30:2 (padrão em diretrizes) para equilibrar compressões contínuas e ventilação sem atrasos excessivos." },
    { q: "Primeira ação ao encontrar vítima inconsciente?", options: ["Ventilar", "Checar pulso", "Garantir segurança da cena", "Aplicar DEA"], answer: 2,
      explain: "A abordagem inicial prioriza segurança da cena e acionamento de ajuda/DEA, evitando risco ao socorrista e atrasos." },
    { q: "Tempo de checagem de pulso no adulto?", options: ["5–10s", "20s", "30s", "1 min"], answer: 0,
      explain: "A checagem de pulso deve ser rápida (≤10s) para não retardar o início das compressões." },
    { q: "Qual ritmo é tipicamente chocável pelo DEA?", options: ["Assistolia", "Fibrilação ventricular", "AESP", "Bradicardia"], answer: 1,
      explain: "FV/TV sem pulso são ritmos chocáveis; assistolia e AESP são não-chocáveis e exigem RCP + tratamento de causas." },
    { q: "Após o choque, o que fazer?", options: ["Checar pulso por 30s", "Ventilar por 1 min", "Retomar compressões imediatamente", "Administrar sedação"], answer: 2,
      explain: "Após choque, retomar compressões imediatamente minimiza queda de perfusão coronariana (princípio básico de RCP de qualidade)." },
    { q: "Qual é um ritmo não-chocável?", options: ["FV", "TV sem pulso", "AESP", "TV com pulso"], answer: 2,
      explain: "AESP (e assistolia) não são chocáveis: foco em compressões, adrenalina conforme protocolo e causas reversíveis." },
    { q: "Qual afirmação está correta sobre compressões?", options: ["Devem ser lentas", "Devem ser superficiais", "Devem ter recuo total", "Devem ter pausas longas"], answer: 2,
      explain: "Recuo total melhora retorno venoso; pausas e compressões superficiais reduzem perfusão efetiva." },
    { q: "Troca de socorrista durante RCP ocorre idealmente a cada:", options: ["1 min", "2 min", "5 min", "10 min"], answer: 1,
      explain: "Troca a cada ~2 min reduz fadiga e mantém qualidade de compressão." },
    { q: "PCR pediátrica geralmente tem origem:", options: ["Cardíaca primária", "Respiratória/hipóxica", "Elétrica", "Medicamentos"], answer: 1,
      explain: "Em pediatria, hipóxia/insuficiência respiratória são causas comuns; por isso ventilação precoce tem relevância." },
    { q: "Relação compressão/ventilação com 2 socorristas (criança/lactente):", options: ["30:2", "20:2", "15:2", "10:1"], answer: 2,
      explain: "Com 2 socorristas, 15:2 é padrão em diretrizes para melhorar ventilação sem reduzir compressões excessivamente." },
    { q: "No lactente, compressões podem ser feitas com:", options: ["2 mãos", "1 mão", "2 dedos", "Punho"], answer: 2,
      explain: "Lactente: 2 dedos (ou técnica dos polegares com 2 socorristas) para controle e profundidade adequada." },
    { q: "Critério consistente de PCR é:", options: ["Dor torácica", "Cianose isolada", "Apneia + ausência de pulso", "Agitação"], answer: 2,
      explain: "PCR se caracteriza por ausência de pulso e respiração eficaz; sinais isolados não definem PCR." },
    { q: "Local correto das mãos no adulto:", options: ["Epigastro", "Centro do esterno", "Clavícula", "Hipocôndrio"], answer: 1,
      explain: "Centro do esterno (metade inferior) é o ponto recomendado para compressões efetivas." },
    { q: "Oxigênio no BLS:", options: ["Sempre obrigatório", "Nunca usar", "Usar se disponível sem atrasar RCP", "Somente em UTI"], answer: 2,
      explain: "O2 suplementar pode ser usado quando disponível, mas sem atrasar compressões/DEA." },
    { q: "Interrupção máxima recomendada das compressões:", options: ["2s", "5s", "10s", "20s"], answer: 2,
      explain: "Pausas ≤10s (ex.: checar ritmo/choque) preservam perfusão; pausas longas pioram desfecho." },
    { q: "Objetivo principal do BLS:", options: ["Sedar", "Manter perfusão e oxigenação", "Dar antibiótico", "Fazer exames"], answer: 1,
      explain: "BLS mantém circulação/oxigenação até reversão do ritmo e suporte avançado." },
    { q: "Etapa que melhora desfecho em FV/TV é:", options: ["Antibiótico precoce", "DEA precoce", "Curativo", "Soroterapia"], answer: 1,
      explain: "Desfibrilação precoce é determinante em ritmos chocáveis (FV/TV)." },
    { q: "RCP de qualidade inclui:", options: ["Compressão lenta e profunda", "Compressões rápidas e superficiais", "100–120/min e recuo total", "Pausas longas para ventilação"], answer: 2,
      explain: "Qualidade de compressão e mínima interrupção são pilares das diretrizes." },
  ];

  const ACLS = [
    { q: "Droga antiarrítmica comum em FV/TV refratária:", options: ["Atropina", "Adrenalina", "Amiodarona", "Furosemida"], answer: 2,
      explain: "Após choques e adrenalina, diretrizes ACLS frequentemente indicam amiodarona como antiarrítmico em FV/TV refratária." },
    { q: "Dose de adrenalina na PCR (adulto):", options: ["0,1 mg", "1 mg", "5 mg", "10 mg"], answer: 1,
      explain: "Adrenalina 1 mg IV/IO em PCR, repetida em intervalos usuais conforme algoritmos ACLS." },
    { q: "Intervalo típico da adrenalina na PCR:", options: ["1 min", "3–5 min", "10 min", "15 min"], answer: 1,
      explain: "Repetição a cada 3–5 min enquanto mantém RCP de alta qualidade e busca causas reversíveis." },
    { q: "Ritmo chocável:", options: ["AESP", "Assistolia", "FV", "BAV"], answer: 2,
      explain: "FV/TV sem pulso são chocáveis; AESP/assistolia não são chocáveis." },
    { q: "Melhor método para confirmar intubação:", options: ["RX", "Ausculta", "Capnografia (ETCO₂)", "Oximetria"], answer: 2,
      explain: "Capnografia é referência para confirmar posicionamento e monitorar ventilação/perfusão." },
    { q: "Taquicardia instável com pulso: conduta prioritária:", options: ["Observação", "Cardioversão sincronizada", "Alta", "Adenosina VO"], answer: 1,
      explain: "Instabilidade hemodinâmica em taquiarritmia com pulso indica cardioversão sincronizada." },
    { q: "Assistolia: conduta adequada:", options: ["Choque", "RCP + adrenalina + causas reversíveis", "Amiodarona", "Cardioversão"], answer: 1,
      explain: "Assistolia é não-chocável; manter RCP, adrenalina e investigar 5H/5T." },
    { q: "AESP significa:", options: ["Ritmo organizado sem pulso", "Assistolia", "FV", "FA"], answer: 0,
      explain: "Há atividade elétrica no monitor, porém sem pulso efetivo: foco em RCP e causas reversíveis." },
    { q: "Capnografia elevada durante RCP geralmente indica:", options: ["Piora", "Melhor perfusão", "Hipoglicemia", "Sedação"], answer: 1,
      explain: "ETCO₂ maior sugere melhor fluxo pulmonar/perfusão, frequentemente associada a compressões mais efetivas." },
    { q: "Via preferencial para drogas na PCR:", options: ["VO", "IM", "IV/IO", "SC"], answer: 2,
      explain: "Via IV/IO é recomendada por rápida biodisponibilidade." },
    // +10 para fechar 20 ACLS
    { q: "Ritmo não-chocável:", options: ["FV", "TV sem pulso", "AESP", "TV"], answer: 2,
      explain: "AESP/assistolia não são chocáveis; priorize RCP, drogas e correção de causas." },
    { q: "Pausa máxima recomendada para checar ritmo/choque:", options: ["2s", "5s", "10s", "30s"], answer: 2,
      explain: "Minimizar pausas (≤10s) melhora perfusão coronariana e cerebral." },
    { q: "Em bradicardia sintomática, droga inicial comum:", options: ["Adenosina", "Atropina", "Amiodarona", "Midazolam"], answer: 1,
      explain: "Atropina é primeira linha em bradicardia sintomática em diversos algoritmos." },
    { q: "No pós-ROSC, evitar:", options: ["Hipóxia", "Monitorização", "Oxigênio titulado", "Tratamento da causa"], answer: 0,
      explain: "Evitar hipóxia e instabilidade hemodinâmica; titular O2 para evitar hiperóxia." },
    { q: "Ritmo chocável mais clássico:", options: ["Assistolia", "AESP", "FV", "BAV"], answer: 2,
      explain: "FV é o protótipo de ritmo chocável." },
    { q: "Objetivo do time na PCR:", options: ["Exames", "RCP + desfibrilação + causas reversíveis", "Curativos", "Alta"], answer: 1,
      explain: "Conduta baseada em algoritmo: RCP de qualidade, desfibrilação quando indicada e correção de causas." },
    { q: "Em PCR, ventilação excessiva:", options: ["Ajuda sempre", "Pode prejudicar perfusão", "É obrigatória", "Não muda"], answer: 1,
      explain: "Hiperventilação aumenta pressão intratorácica e pode reduzir retorno venoso, piorando perfusão." },
    { q: "Um sinal de ROSC durante RCP:", options: ["ETCO₂ em elevação sustentada", "Palidez", "FR 0", "Sem pulso"], answer: 0,
      explain: "Elevação sustentada do ETCO₂ pode sinalizar retorno de circulação." },
    { q: "Uma causa reversível (5H/5T) é:", options: ["Hipóxia", "Hipertermia", "Hepatite", "Histeria"], answer: 0,
      explain: "Hipóxia é causa reversível clássica; investigar e tratar rapidamente." },
    { q: "Qualidade da RCP depende de:", options: ["Pausas longas", "Compressão rasa", "Ritmo/profundidade/recuo", "Apenas drogas"], answer: 2,
      explain: "Compressões eficazes e mínimas interrupções são determinantes; drogas não substituem RCP de qualidade." },
  ];

  const NEONATAL = [
    { q: "No RN, a intervenção mais importante na reanimação é:", options: ["Choque", "Ventilação eficaz", "Antibiótico", "Transfusão"], answer: 1,
      explain: "NRP/consensos destacam ventilação efetiva como principal intervenção inicial na maioria dos casos." },
    { q: "Relação compressão/ventilação no RN:", options: ["30:2", "15:2", "3:1", "5:1"], answer: 2,
      explain: "Padrão clássico neonatal: 3:1, pois a causa costuma ser hipóxica/respiratória." },
    { q: "Frequência total de eventos (compressões + ventilações) no RN:", options: ["60/min", "90/min", "120/min", "150/min"], answer: 2,
      explain: "Em reanimação neonatal: 120 eventos/min (90 compressões + 30 ventilações)." },
    { q: "Indicação típica de VPP no RN:", options: ["Choro forte", "FC <100 e/ou apneia", "FC 140", "Corado"], answer: 1,
      explain: "Apneia/respiração ineficaz ou FC <100 indicam VPP." },
    { q: "SatO₂ alvo aproximado no 1º minuto:", options: ["60–65%", "90–95%", "100%", "80–85%"], answer: 0,
      explain: "Saturação aumenta gradualmente nos primeiros minutos; alvos iniciais são mais baixos." },
    // +15
    { q: "Via preferencial para drogas no RN em reanimação:", options: ["VO", "IM", "Umbilical IV", "SC"], answer: 2,
      explain: "Acesso umbilical é via recomendada quando necessário administrar medicação." },
    { q: "Oxigênio inicial no RN a termo costuma iniciar com:", options: ["100%", "80%", "50%", "Ar ambiente"], answer: 3,
      explain: "Iniciar com ar ambiente e titular conforme saturação-alvo (NRP/consensos)." },
    { q: "FC desejável após estabilização inicial:", options: [">60", ">80", ">100", ">140"], answer: 2,
      explain: "FC >100 bpm é sinal de resposta adequada." },
    { q: "RN prematuro: prioridade adicional é:", options: ["Termorregulação", "Hiperventilação", "Hipóxia induzida", "Sedação"], answer: 0,
      explain: "Prematuros perdem calor facilmente; aquecimento reduz complicações." },
    { q: "Se VPP é ineficaz, uma medida essencial é:", options: ["Ajustar vedação/posicionamento", "Aguardar", "Suspender ventilação", "Dar alta"], answer: 0,
      explain: "Melhorar vedação e posicionamento (passos de correção) é fundamental para VPP eficaz." },
    { q: "Compressões no RN são indicadas se:", options: ["FC >100", "FC 80 com boa VPP", "FC <60 apesar de ventilação eficaz", "Apenas cianose"], answer: 2,
      explain: "Se FC permanece <60 após ventilação eficaz, iniciar compressões." },
    { q: "Técnica comum de compressão no RN:", options: ["Polegares (preferencial) ou 2 dedos", "Punho", "Palmada", "Cotovelos"], answer: 0,
      explain: "Técnica dos polegares é preferida por gerar melhor profundidade e controle." },
    { q: "Frequência de VPP neonatal:", options: ["10/min", "20/min", "40–60/min", "100/min"], answer: 2,
      explain: "VPP 40–60/min é referência clássica na reanimação neonatal." },
    { q: "APGAR possui:", options: ["3 itens", "5 itens", "7 itens", "10 itens"], answer: 1,
      explain: "APGAR avalia 5 componentes (Aparência, Pulso, Grimace, Atividade, Respiração)." },
    { q: "Adrenalina neonatal (ordem geral):", options: ["Sempre primeiro", "Após falha de ventilação/compressões e indicação", "Nunca", "Somente VO"], answer: 1,
      explain: "Medicação é após intervenções primárias e critérios (NRP)." },
    { q: "Hipotermia no RN tende a:", options: ["Ajudar", "Piorar estabilidade", "Não interferir", "Curar apneia"], answer: 1,
      explain: "Hipotermia piora metabolismo/oxigenação e está associada a piores desfechos." },
    { q: "Reavaliação na reanimação neonatal ocorre em:", options: ["A cada 5 min", "A cada 1 min", "Somente no final", "A cada 30 min"], answer: 1,
      explain: "Reavaliar em ciclos curtos (~60s) para ajustar conduta." },
    { q: "Causa mais comum de depressão neonatal é:", options: ["Asfixia/hipóxia", "IAM", "Arritmia primária", "Hipertireoidismo"], answer: 0,
      explain: "A maior parte decorre de hipóxia/asfixia; por isso ventilação é central." },
    { q: "Se o RN melhora FC e respiração:", options: ["Manter suporte e monitorar", "Iniciar compressões", "Parar aquecimento", "Dar sedação"], answer: 0,
      explain: "Com melhora, manter suporte, monitorização e titulação de O2 conforme alvo." },
    { q: "Objetivo prático da VPP é:", options: ["Aumentar ventilação alveolar", "Sedação", "Diminuir perfusão", "Aumentar febre"], answer: 0,
      explain: "VPP visa ventilação eficaz e melhora da oxigenação/FC." },
    { q: "Quando considerar via aérea avançada no RN:", options: ["VPP ineficaz persistente", "Sempre no início", "Somente se FC 140", "Nunca"], answer: 0,
      explain: "Se máscara falha, considerar dispositivo alternativo/IA avançada conforme protocolo." },
  ];

  const ENFERMAGEM = [
    { q: "Primeira ação ao reconhecer PCR no hospital:", options: ["Chamar ajuda/time e iniciar protocolo", "Esperar médico", "Aplicar antibiótico", "Fazer curativo"], answer: 0,
      explain: "Segurança do paciente: acionar time e iniciar medidas imediatas reduz atraso e melhora resposta." },
    { q: "Prática central para reduzir erro de medicação:", options: ["5 certos", "Aplicar rápido", "Sem conferir alergia", "Sem identificação"], answer: 0,
      explain: "Checagens padronizadas (5 certos e afins) são estratégia básica de segurança." },
    { q: "Comunicação estruturada em passagem/urgência:", options: ["SBAR", "Somente informal", "Somente áudio", "Sem registro"], answer: 0,
      explain: "SBAR reduz falhas de comunicação, reconhecido em segurança do paciente." },
    { q: "Prevenção de LPP em acamados:", options: ["Mudança de decúbito e cuidados com pele", "Massagem forte", "Imobilizar", "Sem hidratação"], answer: 0,
      explain: "Reposicionamento, avaliação de risco e cuidado da pele são recomendados em protocolos assistenciais." },
    { q: "Higienização das mãos segue:", options: ["5 momentos OMS", "Somente ao fim do plantão", "Só se sujo", "Nunca"], answer: 0,
      explain: "OMS: 5 momentos para reduzir transmissão cruzada." },
    // +15
    { q: "Em transfusão, segurança crítica é:", options: ["Dupla checagem de identificação", "Acelerar infusão", "Ignorar sinais vitais", "Sem registro"], answer: 0,
      explain: "Dupla checagem e rastreabilidade reduzem eventos transfusionais graves." },
    { q: "SpO₂ baixa exige:", options: ["Avaliar clinicamente e intervir", "Ignorar se paciente 'não reclama'", "Dar alta", "Somente hidratar"], answer: 0,
      explain: "Monitorização e intervenção precoce previnem deterioração clínica." },
    { q: "Isolamento de contato inclui:", options: ["Luvas e avental", "Só touca", "Só óculos", "Sem EPI"], answer: 0,
      explain: "Precauções por contato: barreiras para reduzir transmissão por superfícies/contato." },
    { q: "Evento adverso deve ser:", options: ["Notificado", "Ocultado", "Ignorado", "Punido sem análise"], answer: 0,
      explain: "Cultura de segurança: notificação e análise de causa melhoram processos." },
    { q: "Controle hídrico significa:", options: ["Entradas e saídas registradas", "Apenas peso", "Apenas PA", "Apenas glicemia"], answer: 0,
      explain: "Balanço hídrico auxilia avaliação hemodinâmica/renal e decisões clínicas." },
    { q: "Curativo estéril utiliza:", options: ["Técnica asséptica", "Sem luvas", "Pano qualquer", "Água apenas"], answer: 0,
      explain: "Técnica asséptica reduz risco de infecção relacionada à assistência." },
    { q: "Paciente com risco de queda: medida básica é:", options: ["Identificação e barreiras/ambiente seguro", "Sedar sempre", "Deixar sem grade", "Ignorar"], answer: 0,
      explain: "Prevenção de queda: sinalização, orientação e ambiente seguro." },
    { q: "Registro assistencial deve ser:", options: ["Claro, objetivo e rastreável", "Apenas verbal", "Sem horário", "Sem assinatura"], answer: 0,
      explain: "Registro é componente legal e assistencial; deve ser completo e rastreável." },
    { q: "Rotina segura na administração EV inclui:", options: ["Identificação + prescrição + diluição/compatibilidade", "Aplicar sem conferir", "Misturar drogas sem checar", "Não rotular"], answer: 0,
      explain: "Checagens reduzem incompatibilidades e eventos adversos." },
    { q: "Bradicardia sintomática: conduta inicial da equipe é:", options: ["Avaliar ABC, monitorar e acionar protocolo", "Dar alta", "Suspender O2", "Ignorar"], answer: 0,
      explain: "Avaliar ABC e acionar suporte conforme protocolo é base da abordagem emergencial." },
    { q: "Segurança do paciente inclui:", options: ["Identificação correta", "Sem pulseira", "Sem checar alergia", "Sem comunicação"], answer: 0,
      explain: "Identificação correta é meta essencial de segurança do paciente." },
    { q: "Vigilância de sinais vitais:", options: ["Conforme risco/condição e protocolo", "1x/dia para todos", "Nunca", "Somente quando grave"], answer: 0,
      explain: "Frequência é individualizada por risco e condição clínica." },
    { q: "Paciente em isolamento aerossol:", options: ["PFF2/N95 e ambiente adequado", "Sem máscara", "Máscara de tecido", "Touca apenas"], answer: 0,
      explain: "Precaução por aerossóis envolve respirador e medidas ambientais." },
    { q: "Em deterioração clínica, acionar:", options: ["Time de resposta rápida / protocolo local", "Somente familiar", "Somente limpeza", "Somente recepção"], answer: 0,
      explain: "Time de resposta rápida reduz atrasos em intervenções críticas." },
    { q: "Reavaliação pós-intervenção deve ser:", options: ["Documentada", "Ignorada", "Só se der tempo", "Somente verbal"], answer: 0,
      explain: "Monitorar resposta e documentar é parte do cuidado seguro." },
  ];

  const BIOSEG = [
    { q: "Precaução padrão aplica-se a:", options: ["Só infectados", "Todos pacientes", "Somente UTI", "Somente isolados"], answer: 1,
      explain: "Precaução padrão é aplicada a todos, reduzindo risco de transmissão cruzada." },
    { q: "Máscara indicada para aerossóis:", options: ["Cirúrgica", "PFF2/N95", "Tecido", "Nenhuma"], answer: 1,
      explain: "Aerossóis exigem respirador (PFF2/N95) conforme recomendações de controle de infecção." },
    { q: "Perfurocortante deve ser descartado em:", options: ["Lixo comum", "Descarpack", "Saco azul", "Caixa de papel"], answer: 1,
      explain: "Coletor rígido (descarpack) previne acidentes ocupacionais." },
    { q: "Higienização das mãos com álcool dura:", options: ["5s", "10s", "20–30s", "2 min"], answer: 2,
      explain: "Fricção por 20–30s é referência prática para ação adequada do álcool." },
    { q: "Acidente biológico: primeira ação:", options: ["Omitir", "Lavar e notificar/seguir protocolo", "Esperar", "Passar perfume"], answer: 1,
      explain: "Lavar e notificar imediatamente permite avaliação e profilaxia quando indicada." },
    // +15
    { q: "Luva substitui higiene das mãos?", options: ["Sim", "Não", "Às vezes", "Sempre"], answer: 1,
      explain: "Luva não substitui higiene; mãos devem ser higienizadas antes/depois." },
    { q: "Óculos/face shield são indicados quando:", options: ["Risco de respingo", "Nunca", "Somente à noite", "Só em ambulatório"], answer: 0,
      explain: "Risco de respingo de fluídos requer proteção ocular/facial." },
    { q: "Precaução padrão inclui:", options: ["Higiene das mãos + EPI conforme risco", "Apenas máscara", "Apenas luva", "Nenhuma"], answer: 0,
      explain: "EPI é conforme risco (respingo, contato, etc.)." },
    { q: "Recapar agulha é:", options: ["Recomendado", "Não recomendado", "Obrigatório", "Indiferente"], answer: 1,
      explain: "Recapar aumenta risco de perfuração; protocolos recomendam não recapear." },
    { q: "Remover adornos no cuidado é:", options: ["Recomendado", "Proibido", "Indiferente", "Obrigatório usar"], answer: 0,
      explain: "Adornos aumentam contaminação e dificultam higiene adequada das mãos." },
    { q: "Esterilização elimina:", options: ["Bactérias apenas", "Vírus apenas", "Esporos também", "Nada"], answer: 2,
      explain: "Esterilização visa eliminar microrganismos, inclusive esporos." },
    { q: "Desparamentação é crítica por:", options: ["Maior risco de autocontaminação", "Frio", "Barulho", "Luz"], answer: 0,
      explain: "Remoção inadequada do EPI é causa frequente de contaminação." },
    { q: "Limpeza de superfícies envolve:", options: ["Detergente + desinfecção", "Pano seco", "Só água", "Só perfume"], answer: 0,
      explain: "Primeiro limpar (remover sujidade) e depois desinfetar conforme protocolo." },
    { q: "Treinamento em biossegurança é:", options: ["Obrigatório", "Opcional", "Raro", "Desnecessário"], answer: 0,
      explain: "Treinamento periódico é medida de prevenção de risco ocupacional." },
    { q: "Máscara cirúrgica é mais indicada para:", options: ["Gotículas", "Aerossóis", "Radiação", "Químicos"], answer: 0,
      explain: "Máscara cirúrgica é barreira para gotículas; aerossóis exigem respirador." },
    { q: "Precaução de contato requer:", options: ["Avental e luvas", "Somente máscara", "Somente óculos", "Nada"], answer: 0,
      explain: "Contato: barreiras para reduzir transmissão por toque/superfícies." },
    { q: "Após retirar luvas, deve-se:", options: ["Higienizar as mãos", "Tocar no rosto", "Calçar outra luva", "Sair"], answer: 0,
      explain: "Higiene das mãos após remover luvas é passo crítico." },
    { q: "A PFF2/N95 deve:", options: ["Vedar bem no rosto", "Ficar frouxa", "Ser compartilhada", "Ser molhada"], answer: 0,
      explain: "Vedação adequada é essencial para efetividade do respirador." },
    { q: "Um objetivo central da biossegurança é:", options: ["Reduzir riscos ao paciente e equipe", "Aumentar custos", "Diminuir higiene", "Evitar registros"], answer: 0,
      explain: "Biossegurança protege paciente, equipe e ambiente assistencial." },
    { q: "Precaução padrão + adicional ocorre quando:", options: ["Há risco/diagnóstico de transmissão específica", "Nunca", "Somente em casa", "Só em clínica estética"], answer: 0,
      explain: "Precauções adicionais são por via de transmissão (contato/gotículas/aerossóis)." },
  ];

  const BANKS = {
    "BLS (Suporte Básico)": BLS,
    "ACLS (Suporte Avançado)": ACLS,
    "Neonatal": NEONATAL,
    "Enfermagem": ENFERMAGEM,
    "Biosegurança": BIOSEG,
  };

  // ===== CASOS CLÍNICOS =====
  // { theme, area, level, profession, text, options[4], answer, hint }
  const CASES = [
    {
      theme: "PCR em ambiente hospitalar (corredor/ala)",
      area: "BLS",
      level: "Básico",
      profession: "Enfermagem / Fisioterapia",
      text:
        "Você encontra um adulto caído no corredor do hospital. Não responde ao chamado, não há respiração eficaz. " +
        "Há equipe próxima, porém ainda sem carrinho de emergência no local. Qual conduta inicial é mais segura e efetiva?",
      options: [
        "Ventilar por 2 minutos e só depois iniciar compressões",
        "Garantir segurança, acionar ajuda/DEA e iniciar compressões imediatamente",
        "Buscar acesso venoso antes de iniciar RCP",
        "Transportar o paciente para a sala e depois avaliar"
      ],
      answer: 1,
      hint: "Priorize: segurança + acionar ajuda/DEA + compressões de qualidade sem atrasos."
    },
    {
      theme: "Ritmo chocável e sequência de ações",
      area: "BLS/ACLS",
      level: "Intermediário",
      profession: "Equipe multiprofissional",
      text:
        "Durante a RCP, o DEA indica choque. A equipe aplica o choque com segurança. Qual deve ser a próxima ação imediata " +
        "para preservar perfusão coronariana e cerebral?",
      options: [
        "Checar pulso por 30 segundos antes de retomar compressões",
        "Retomar compressões imediatamente por 2 minutos",
        "Aguardar 1 minuto para reavaliar saturação",
        "Administrar sedação e depois comprimir"
      ],
      answer: 1,
      hint: "Após choque: retome compressões sem pausa prolongada."
    },
    {
      theme: "Taquiarritmia instável com pulso",
      area: "ACLS",
      level: "Avançado",
      profession: "Enfermagem / Médico / Fisioterapia (apoio)",
      text:
        "Paciente em monitor com taquicardia de QRS largo, hipotenso, rebaixamento e sinais de má perfusão. " +
        "A equipe suspeita instabilidade hemodinâmica. Qual conduta imediata é mais apropriada?",
      options: [
        "Observação e repetir ECG em 30 minutos",
        "Cardioversão sincronizada conforme protocolo e monitorização",
        "Adenosina por via oral",
        "Alta para casa"
      ],
      answer: 1,
      hint: "Instabilidade + taquiarritmia com pulso = cardioversão sincronizada."
    },
    {
      theme: "Reanimação neonatal – ventilação como prioridade",
      area: "Neonatal",
      level: "Básico",
      profession: "Enfermagem / Pediatria",
      text:
        "RN em sala de parto com apneia e FC 80 bpm. A equipe já aqueceu e posicionou a via aérea. " +
        "Qual intervenção tem maior impacto imediato para elevar FC e melhorar oxigenação?",
      options: [
        "Compressões imediatamente (3:1)",
        "Ventilação com pressão positiva (VPP) 40–60/min e reavaliar",
        "Adrenalina umbilical antes de ventilar",
        "Aguardar evolução espontânea por 2 minutos"
      ],
      answer: 1,
      hint: "No RN, ventilação eficaz costuma ser a intervenção mais determinante."
    },
    {
      theme: "Biossegurança – acidente com perfurocortante",
      area: "Biosegurança",
      level: "Básico",
      profession: "Enfermagem / Equipe",
      text:
        "Durante punção venosa, ocorre acidente com perfurocortante. Qual deve ser a sequência inicial mais correta " +
        "para reduzir risco ocupacional e garantir conduta adequada?",
      options: [
        "Apenas colocar curativo e seguir o plantão",
        "Lavar o local, notificar e seguir protocolo institucional de acidente biológico",
        "Aguardar o fim do plantão para informar",
        "Passar álcool e não registrar"
      ],
      answer: 1,
      hint: "Lavar e notificar imediatamente possibilita avaliação e medidas de profilaxia."
    },
  ];

  // ===== SIMULAÇÕES =====
  // { area, level, profession, name, hint, steps:[{vitals, prompt, options:[{t, ok, feedback}]}] }
  const SIMS = [
    {
      area: "BLS",
      level: "Básico",
      profession: "Enfermagem / Fisioterapia",
      name: "PCR: início do atendimento e DEA",
      hint: "Sequência prática: segurança → aciona ajuda/DEA → compressões → choque quando indicado → retomar compressões.",
      steps: [
        {
          vitals: { FC: "—", FR: "0", SPO2: "—", PA: "—" },
          prompt: "Paciente colapsa e está apneico. Qual é a melhor ação inicial?",
          options: [
            { t: "Garantir segurança, acionar ajuda/DEA e iniciar compressões", ok: true, feedback: "Correto: reduz atraso e inicia RCP de qualidade." },
            { t: "Procurar acesso venoso antes de iniciar RCP", ok: false, feedback: "Evite atrasar compressões. Acesso vem depois." },
            { t: "Aguardar equipe completa para iniciar", ok: false, feedback: "RCP deve começar imediatamente." },
          ],
        },
        {
          vitals: { FC: "—", FR: "0", SPO2: "—", PA: "—" },
          prompt: "DEA indica choque. Após o choque, o que fazer?",
          options: [
            { t: "Checar pulso por 30s", ok: false, feedback: "Pausas longas reduzem perfusão." },
            { t: "Retomar compressões imediatamente", ok: true, feedback: "Correto: compressões contínuas aumentam chance de ROSC." },
            { t: "Aguardar 1 min e reavaliar", ok: false, feedback: "Evite atrasos após o choque." },
          ],
        },
      ],
    },
    {
      area: "ACLS",
      level: "Intermediário",
      profession: "Equipe multiprofissional",
      name: "AESP: foco em causas reversíveis",
      hint: "AESP: RCP + adrenalina conforme protocolo + procurar e tratar causas reversíveis (5H/5T).",
      steps: [
        {
          vitals: { FC: "—", FR: "0", SPO2: "—", PA: "—" },
          prompt: "Monitor mostra atividade elétrica organizada, porém sem pulso (AESP). Conduta correta?",
          options: [
            { t: "Choque imediato", ok: false, feedback: "AESP não é ritmo chocável." },
            { t: "RCP + adrenalina conforme protocolo e investigar 5H/5T", ok: true, feedback: "Correto: foco em perfusão e causas reversíveis." },
            { t: "Encerrar atendimento", ok: false, feedback: "Sem critérios de interrupção, manter suporte e investigar causas." },
          ],
        },
        {
          vitals: { FC: "—", FR: "0", SPO2: "—", PA: "—" },
          prompt: "Qual destas é uma causa reversível clássica (exemplo)?",
          options: [
            { t: "Hipóxia", ok: true, feedback: "Correto: hipóxia é causa frequente e reversível." },
            { t: "Apendicite", ok: false, feedback: "Não é causa típica de PCR imediata." },
            { t: "Cefaleia", ok: false, feedback: "Não é causa típica do algoritmo." },
          ],
        },
      ],
    },
    {
      area: "Neonatal",
      level: "Básico",
      profession: "Enfermagem / Pediatria",
      name: "RN apneico: ventilação e reavaliação",
      hint: "Na maioria dos RN deprimidos, ventilação eficaz é a medida com maior impacto inicial.",
      steps: [
        {
          vitals: { FC: "80", FR: "0", SPO2: "60%", PA: "—" },
          prompt: "RN apneico com FC 80. Conduta prioritária?",
          options: [
            { t: "Iniciar VPP 40–60/min e reavaliar", ok: true, feedback: "Correto: ventilação eficaz tende a elevar FC." },
            { t: "Iniciar compressões imediatamente", ok: false, feedback: "Antes: assegurar ventilação eficaz." },
            { t: "Administrar adrenalina já", ok: false, feedback: "Medicação não é primeira linha." },
          ],
        },
        {
          vitals: { FC: "110", FR: "—", SPO2: "65%", PA: "—" },
          prompt: "FC subiu para 110 após VPP. Próximo passo adequado?",
          options: [
            { t: "Manter suporte, monitorar e titular O2 conforme alvo", ok: true, feedback: "Correto: estabilização e titulação conforme saturação." },
            { t: "Iniciar compressões 3:1", ok: false, feedback: "Com FC >100, compressões não são indicadas." },
            { t: "Suspender aquecimento", ok: false, feedback: "Manter normotermia é essencial." },
          ],
        },
      ],
    },
    {
      area: "Biosegurança",
      level: "Intermediário",
      profession: "Enfermagem / Equipe",
      name: "Paramentação e precauções por aerossol",
      hint: "Aerossóis: respirador (PFF2/N95), vedação, higiene das mãos e técnica de retirada do EPI.",
      steps: [
        {
          vitals: { FC: "—", FR: "—", SPO2: "—", PA: "—" },
          prompt: "Paciente em precaução por aerossol. Qual EPI respiratório é o mais adequado?",
          options: [
            { t: "Máscara cirúrgica", ok: false, feedback: "Cirúrgica é barreira para gotículas; aerossol pede respirador." },
            { t: "PFF2/N95 com vedação adequada", ok: true, feedback: "Correto: respirador é indicado para aerossóis." },
            { t: "Máscara de tecido", ok: false, feedback: "Não é indicada em ambiente assistencial para aerossóis." },
          ],
        },
      ],
    },
    {
      area: "Enfermagem",
      level: "Básico",
      profession: "Enfermagem",
      name: "Segurança do paciente: identificação e medicação",
      hint: "Checagens (identificação, alergias, 5 certos) reduzem erros e eventos adversos.",
      steps: [
        {
          vitals: { FC: "—", FR: "—", SPO2: "—", PA: "—" },
          prompt: "Antes de administrar medicação EV, qual conduta é mais segura?",
          options: [
            { t: "Aplicar rapidamente para ganhar tempo", ok: false, feedback: "A pressa aumenta risco de erro." },
            { t: "Confirmar identificação, prescrição, alergias e 5 certos", ok: true, feedback: "Correto: checagens são base de segurança." },
            { t: "Administrar sem checar, pois está prescrito", ok: false, feedback: "Prescrição não elimina necessidade de checagem." },
          ],
        },
      ],
    },
  ];

  // ===== MEMÓRIA (com emoji) =====
  // { id, term, def, emoji }
  const MEMORY_PAIRS = shuffle([
    { term: "DEA", def: "Desfibrilador externo automático", emoji: "⚡" },
    { term: "FV", def: "Ritmo chocável em PCR", emoji: "💓" },
    { term: "AESP", def: "Atividade elétrica sem pulso", emoji: "📉" },
    { term: "SBAR", def: "Comunicação segura estruturada", emoji: "🗣️" },
    { term: "Precaução padrão", def: "Aplicada a todos os pacientes", emoji: "🧼" },
    { term: "PFF2/N95", def: "Proteção para aerossóis", emoji: "😷" },
    { term: "ETCO₂", def: "Capnografia (ventilação/perfusão)", emoji: "📟" },
    { term: "LPP", def: "Lesão por pressão", emoji: "🛏️" },
    { term: "VPP", def: "Ventilação com pressão positiva", emoji: "💨" },
    { term: "3:1", def: "Compressão/ventilação no RN", emoji: "👶" },
    { term: "Descarpack", def: "Coletor para perfurocortantes", emoji: "🩸" },
    { term: "5 momentos", def: "Higiene das mãos (OMS)", emoji: "🧴" },
    { term: "SpO₂", def: "Saturação periférica de oxigênio", emoji: "🫁" },
    { term: "RCP", def: "Ressuscitação cardiopulmonar", emoji: "🫀" },
  ]);

  // ===== FORCA =====
  const HANGMAN_WORDS = shuffle([
    { w: "DESFIBRILADOR", hint: "Equipamento para choque em ritmos chocáveis." },
    { w: "COMPRESSOES", hint: "Principal ação do BLS para manter perfusão." },
    { w: "CAPNOGRAFIA", hint: "Confirma intubação e ajuda a monitorar RCP." },
    { w: "BIOSEGURANCA", hint: "Medidas para reduzir risco ocupacional." },
    { w: "VENTILACAO", hint: "Intervenção-chave no RN deprimido." },
    { w: "ATROPINA", hint: "Usada em bradicardia sintomática em algoritmos." },
    { w: "AMIODARONA", hint: "Antiarrítmico em FV/TV refratária." },
    { w: "ISOLAMENTO", hint: "Precaução por via de transmissão." },
  ]);

  // ===== CAÇA-PALAVRAS =====
  // Palavras devem ser sem acento e sem espaço
  const WORDSEARCH_WORDS = shuffle([
    "DEA","RCP","FV","AESP","SBAR","PFF2","N95","ETCO2","SPO2","VENTILACAO","NEONATAL",
    "BIOSEGURANCA","DESFIBRILADOR","COMPRESSOES","INTUBACAO","OXIGENIO","ISOLAMENTO",
    "BRADICARDIA","AMIODARONA","ATROPINA"
  ]);

  window.SAV_DATA = {
    BANKS,
    CASES,
    SIMS,
    MEMORY_PAIRS,
    HANGMAN_WORDS,
    WORDSEARCH_WORDS,
  };
})();