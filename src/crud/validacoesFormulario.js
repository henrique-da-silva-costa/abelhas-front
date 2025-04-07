export const tipoValorInput = (tipo, temMatriz) => {
    const tiposData = ["data_criacao", "data_alteracao", "data_divisao"];

    if (tiposData.includes(tipo)) {
        return "date";
    }

    if (tipo == "usuario_id") {
        return "hidden";
    }

    if (tipo === "doadora_disco_id" || tipo === "doadora_campeira_id" || tipo === "tipo_divisao_id") {
        if (!temMatriz) {
            return "text"
        }

        return "hidden"
    }

    if (tipo == "tipo_doacao_id") {
        return "hidden";
    }
}

export const tipoLabel = (tipo, temMatriz) => {
    if (tipo == "usuario_id") {
        return ""
    }

    if (tipo === "doadora_disco_id" || tipo === "doadora_campeira_id" || tipo === "tipo_divisao_id") {
        if (!temMatriz) {
            return tipo
        }

        return ""
    }

    if (tipo == "tipo_doacao_id") {
        return "";
    }

    return tipo;
}

export const inputInvisivel = (tipo, temMatriz) => {
    if (tipo === "doadora_disco_id" || tipo === "doadora_campeira_id" || tipo === "tipo_divisao_id") {
        if (!temMatriz) {
            return ""
        }

        return "d-none"
    }

    if (tipo == "tipo_doacao_id") {
        return "d-none"
    }
}