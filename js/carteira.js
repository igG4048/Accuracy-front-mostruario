/* =========================
   CARTEIRA
   Lê os aportes salvos na página de Aportes
   e monta o gráfico de distribuição.
========================= */

const STORAGE_KEY = "accuracy_aportes";


/* Cores de cada classe (são dados, ficam fixas) */

const CLASS_COLORS = {
    "Ações":         "#3b82f6",
    "Cripto":        "#f59e0b",
    "Renda Fixa":    "#10b981",
    "FIIs":          "#eab308",
    "Internacional": "#8b5cf6",
    "Outros":        "#64748b"
};


/* De qual classe é cada ativo do formulário */

const ASSET_CLASS = {
    "PETR4":       "Ações",
    "Bitcoin":     "Cripto",
    "CDB Nubank":  "Renda Fixa",
    "XPML11":      "FIIs"
};


function classOf(item) {

    return (
        item.category ||
        ASSET_CLASS[item.asset] ||
        "Outros"
    );

}


function money(value) {

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);

}


function loadContributions() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

        return Array.isArray(data) ? data : [];

    } catch (error) {

        return [];

    }

}


/* =========================
   AGRUPAR POR CLASSE
========================= */

function groupByClass(contributions) {

    const totals = {};

    let total = 0;


    contributions.forEach(item => {

        const value = Number(item.amount) || 0;

        if (value <= 0) {
            return;
        }

        const name = classOf(item);

        totals[name] = (totals[name] || 0) + value;

        total += value;

    });


    const list =
        Object.keys(totals)
            .map(name => ({
                name,
                value: totals[name],
                percent: (totals[name] / total) * 100
            }))
            .sort((a, b) => b.value - a.value);


    return { list, total };

}


/* =========================
   AGRUPAR POR ATIVO
========================= */

function groupByAsset(contributions) {

    const totals = {};

    let total = 0;


    contributions.forEach(item => {

        const value = Number(item.amount) || 0;

        if (value <= 0) {
            return;
        }

        if (!totals[item.asset]) {

            totals[item.asset] = {
                asset: item.asset,
                className: classOf(item),
                count: 0,
                value: 0
            };

        }

        totals[item.asset].count += 1;
        totals[item.asset].value += value;

        total += value;

    });


    const list =
        Object.values(totals)
            .sort((a, b) => b.value - a.value);


    return { list, total };

}


/* =========================
   GRÁFICO DE PIZZA
========================= */

function renderChart(groups) {

    const circle = document.getElementById("distributionChart");
    const legend = document.getElementById("distributionLegend");

    if (!circle || !legend) {
        return;
    }


    legend.innerHTML = "";


    if (!groups.list.length) {

        circle.style.background = "var(--borda)";

        legend.innerHTML = `
            <div class="legend-empty">
                Faça um aporte para ver a distribuição.
            </div>
        `;

        return;
    }


    /* Monta as fatias do conic-gradient */

    const stops = [];

    let start = 0;


    groups.list.forEach((group, index) => {

        const end =
            index === groups.list.length - 1
                ? 100
                : start + group.percent;

        const color =
            CLASS_COLORS[group.name] ||
            CLASS_COLORS["Outros"];

        stops.push(
            `${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`
        );

        start = end;

    });


    circle.style.background =
        `conic-gradient(${stops.join(", ")})`;


    /* Legenda */

    groups.list.forEach(group => {

        const color =
            CLASS_COLORS[group.name] ||
            CLASS_COLORS["Outros"];

        const row = document.createElement("div");

        row.innerHTML = `
            <span class="legend-name">
                <i class="legend-dot"
                   style="background:${color}"></i>
                ${group.name}
            </span>

            <span>${group.percent.toFixed(1).replace(".", ",")}%</span>
        `;

        legend.appendChild(row);

    });

}


/* =========================
   TABELA DE ATIVOS
========================= */

function renderTable(assets, total) {

    const body = document.getElementById("assetsBody");
    const badge = document.getElementById("assetsCount");

    if (!body) {
        return;
    }


    body.innerHTML = "";


    if (badge) {

        badge.textContent =
            `${assets.length} ${
                assets.length === 1 ? "ativo" : "ativos"
            }`;

    }


    if (!assets.length) {

        body.innerHTML = `
            <tr>
                <td colspan="5" class="table-empty">
                    Nenhum aporte registrado ainda.
                </td>
            </tr>
        `;

        return;
    }


    assets.forEach(item => {

        const percent = (item.value / total) * 100;

        const color =
            CLASS_COLORS[item.className] ||
            CLASS_COLORS["Outros"];

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.asset}</td>

            <td>
                <span class="legend-dot"
                      style="background:${color}"></span>
                ${item.className}
            </td>

            <td>${item.count}</td>

            <td>${money(item.value)}</td>

            <td>${percent.toFixed(1).replace(".", ",")}%</td>
        `;

        body.appendChild(row);

    });

}


/* =========================
   CARDS
========================= */

function renderCards(total) {

    const invested = document.getElementById("totalInvested");
    const equity = document.getElementById("totalEquity");

    if (invested) {
        invested.textContent = money(total);
    }

    if (equity) {
        equity.textContent = money(total);
    }

}


/* =========================
   ATUALIZAR TUDO
========================= */

function updateWallet() {

    const contributions = loadContributions();

    const byClass = groupByClass(contributions);
    const byAsset = groupByAsset(contributions);

    renderChart(byClass);
    renderTable(byAsset.list, byAsset.total);
    renderCards(byClass.total);

}


updateWallet();


/* Atualiza se o aporte for feito em outra aba */

window.addEventListener("storage", event => {

    if (event.key === STORAGE_KEY) {
        updateWallet();
    }

});


/* Atualiza ao voltar para a página */

document.addEventListener("visibilitychange", () => {

    if (!document.hidden) {
        updateWallet();
    }

});