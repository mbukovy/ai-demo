<template>
  <div class="row">
    <div
      v-for="(n,i) in neuron.incoming.targets"
      :key="n.id"
      class="col"
    >
      <div class="text-grey">
        >Neuron {{ n.number }}
      </div>
      (w {{ neuron.incoming.weights[i].toFixed(4) }})
    </div>
  </div>

  <q-separator />

  <div>Neuron {{ neuron.number }}</div>
  <div>
    Output = {{ neuron.output.toFixed(4) }} <br>
    d(Output) = {{ neuron.dOutput.toFixed(4) }}
  </div>

  <q-separator />

  <div class="row">
    <div
      v-for="(n,i) in neuron.outgoing.targets"
      :key="n.id"
      class="col"
    >
      <div class="text-grey">
        >Neuron {{ n.number }}
      </div>
      (w {{ neuron.outgoing.weights[i].toFixed(4) }})
    </div>
  </div>
</template>

<script>
import { Neuron } from 'src/utils/network';

export default {
  name: 'Neuron',
  props: {
    neuron: {
      type: Neuron,
      required: true,
    },
  },
};
</script>
