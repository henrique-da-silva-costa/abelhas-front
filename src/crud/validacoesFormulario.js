export const tipoLabel = (tipo, temMatriz) => {
    if (tipo == "data_criacao") {
        return "data/criação"
    }
    if (tipo == "especie_id") {
        return "espécie"
    }
    if (tipo == "status_id") {
        return "status"
    }
    if (tipo == "descricao") {
        return "descrição"
    }
    if (tipo == "doadora_disco_id") {
        return "doadora/disco"
    }
    if (tipo == "tipo_divisao_id") {
        return "tipo/divisão"
    }
    if (tipo == "doadora_campeira_id") {
        return "doadora/campeira"
    }
    if (tipo == "colmeia_id") {
        return "colmeia"
    }
    if (tipo == "genero_id") {
        return "gênero"
    }

    if (tipo == "img_caminho") {
        return "";
    }

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

export const inputInvisivelEDivisaoColunas = (tipo, temMatriz, formularioNome = "") => {
    if (formularioNome == "doadora") {
        return "";
    }

    const tiposDNone = ["doadora_disco_id", "doadora_campeira_id", "tipo_divisao_id", "usuario_id", "id", "img_caminho"];

    // const sempreNone = ["id"]

    const formularioAbelhasCol6 = [];
    const formularioAbelhasCol3 = [];
    const formularioAbelhasTemId = ["genero_id", "especie_id", "status_id", "doadora_disco_id", "doadora_campeira_id", "tipo_divisao_id"];

    if (tiposDNone.includes(tipo)) {
        if (!temMatriz) {
            // if (formularioNome == "abelhas") {
            if (formularioAbelhasTemId.includes(tipo)) {
                return "col-md-3";
            }
            // }
            // return ""
        }

        return "d-none"
    }

    if (tipo == "tipo_doacao_id") {
        return "d-none"
    }

    if (!tiposDNone.includes(tipo)) {
        // if (formularioNome == "abelhas") {
        if (formularioAbelhasTemId.includes(tipo)) {
            return "col-md-3";
        }

        return "col-md-3";

        // }
    }

}