import { uid } from 'quasar';

export class Neuron {
  constructor(number) {
    this.id = uid();
    this.number = number;

    this.bias = Math.random() * 2 - 1;
    this.squash = 0;
    this.cost = 0;

    // Incoming Connections
    this.incoming = {
      targets: {},
      weights: {},
    };
    // Outgoing Connections
    this.outgoing = {
      targets: {},
      weights: {},
    };

    this.dOutput = 0; // f'(x)
    this.output = 0; // f(x)
    this.dError = 0; // E'(f(x))
    this.error = 0; // E(f(x))
  }

  connect(neuron, weight) {
    this.outgoing.targets[neuron.id] = neuron;
    neuron.incoming.targets[this.id] = this;

    // weight ∈ ℝ && -1 < weight < 1
    neuron.incoming.weights[this.id] = weight === undefined ? Math.random() * 2 - 1 : weight;
    this.outgoing.weights[neuron.id] = neuron.incoming.weights[this.id];
  }

  activate(input) {
    function sigmoid(x) { return 1 / (1 + Math.exp(-x)); } // f(x) = 1 / (1 + e^(-x))
    function dSigmoid(x) { return sigmoid(x) * (1 - sigmoid(x)); } // f'(x) = f(x) * (1 - f(x))

    if (input !== undefined) {
      // Input Neurons
      this.output = input; // f(x)
      this.dOutput = 1; // f'(x)
    } else {
      // Hidden/Output Neurons, Σ (x • w)
      const sum = Object.keys(this.incoming.targets).reduce((
        total,
        target,
      ) => total + this.incoming.targets[target].output * this.incoming.weights[target], this.bias);

      this.dOutput = dSigmoid(sum); // f'(x)
      this.output = sigmoid(sum); // f(x)
    }

    return this.output;
  }

  propagate(target, rate = 0.3) {
    // 𝛿E /𝛿squash
    let sum = this.output - target;

    if (target === undefined) {
      sum = Object.keys(this.outgoing.targets).reduce((
        total,
        tar,
      ) => {
        // Δweight
        this.outgoing.weights[tar] -= rate * this.outgoing.targets[tar].error * this.output;
        this.outgoing.targets[tar].incoming.weights[this.id] = this.outgoing.weights[tar];

        return total + this.outgoing.targets[tar].error * this.outgoing.weights[tar];
      }, 0);
    }

    // 𝛿squash/𝛿sum
    this.error = sum * this.dOutput;

    // Δbias
    this.bias -= rate * this.error;

    return this.error;
  }
}

export class Network {
  constructor(inputs, hiddens, outputs) {
    this.inputLayer = Array(inputs).fill(0).map((v, i) => new Neuron(i));
    this.hiddenLayer = Array(hiddens).fill(0).map((v, i) => new Neuron(i));
    this.outputLayer = Array(outputs).fill(0).map((v, i) => new Neuron(i));

    this.inputLayer.forEach((fromNeuron) => {
      this.hiddenLayer.forEach((toNeuron) => {
        fromNeuron.connect(toNeuron);
      });
    });

    this.hiddenLayer.forEach((fromNeuron) => {
      this.outputLayer.forEach((toNeuron) => {
        fromNeuron.connect(toNeuron);
      });
    });
  }
}
