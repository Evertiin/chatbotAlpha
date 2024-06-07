<template>
    <div class="CardTemplate">
    <q-card class="my-card bg-white text-black" style="position: relative; width: 320px; height: 250px; border: 1px solid #000; border-radius: 15px;">
        <q-card-section>
          <div class="icon-text-container">
    <div class="icon-container">
        <q-icon name="mdi-clock-time-eight-outline" class="icon"></q-icon>
    </div>
    <h3 class="top-heading">Aguardando Pagamento</h3>
</div>
<q-separator inset style="width: 260px;" />
<H2></H2>
<div class="text-subtitle2">Evento acionado quando existe um pagamento pendente</div>
        <q-card-actions vertical>
            <q-btn
            flat
            style="border: 1px solid #1976D2; border-radius: 12px; margin-right: 10px; width: 200px; text-transform: none; background-color: #1976D2; color: white;"
            icon="create"
            >
            Configurar Template
            </q-btn>
            <q-btn
            flat
            style="border: 1px solid #E53935; border-radius: 12px; width: 200px; text-transform: none; background-color: #E53935; color: white;"
            icon="delete"
            >
            Remover Template
            </q-btn>
        </q-card-actions>
        </q-card-section>
    </q-card>
</div>
</template>

<script>

export default {
  name: 'Cards'
}
</script>
<style>
.icon-text-container {
    display: flex; /* Para alinhar o ícone e o texto lado a lado */
    align-items: center; /* Para alinhar verticalmente o ícone e o texto */
}

.icon-container {
    margin-right: 10px; /* Espaço entre o ícone e o texto */
}

.icon {
    font-size: 24px; /* Tamanho do ícone */
    color: #1976D2; /* Cor do ícone */
}

.top-heading {
    margin: 0; /* Remover margens padrão do h2 */
}
</style>
>
