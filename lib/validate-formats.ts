import { formatosPorPlataforma, configsFormatos } from "./config-plataformas";

// Função de validação para garantir consistência entre formatosPorPlataforma e configsFormatos
function validarConsistenciaFormatos() {
  const formatosNaoEncontrados: string[] = [];

  // Verificar se todos os formatos em formatosPorPlataforma existem em configsFormatos
  Object.entries(formatosPorPlataforma).forEach(([plataforma, formatos]) => {
    formatos.forEach((formato) => {
      const chaveConfig = `${plataforma}/${formato.nome}`;
      if (!(chaveConfig in configsFormatos)) {
        formatosNaoEncontrados.push(chaveConfig);
      }
    });
  });

  // Verificar se todas as chaves em configsFormatos existem em formatosPorPlataforma
  const formatosRegistrados = new Set<string>();
  Object.entries(formatosPorPlataforma).forEach(([plataforma, formatos]) => {
    formatos.forEach((formato) => {
      formatosRegistrados.add(`${plataforma}/${formato.nome}`);
    });
  });

  const configsExcedentes = Object.keys(configsFormatos).filter(
    (chave) => !formatosRegistrados.has(chave)
  );

  return {
    formatosValidos:
      formatosNaoEncontrados.length === 0 && configsExcedentes.length === 0,
    formatosNaoEncontrados,
    configsExcedentes,
  };
}

// Executar validação
const resultadoValidacao = validarConsistenciaFormatos();
console.log("Resultado da validação de formatos:");
console.log(JSON.stringify(resultadoValidacao, null, 2));
