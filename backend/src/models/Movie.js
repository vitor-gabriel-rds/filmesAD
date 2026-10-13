const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'O título do filme é obrigatório.'],
      trim: true,
      minlength: [1, 'O título deve conter ao menos 1 caractere.'],
      maxlength: [200, 'O título não pode exceder 200 caracteres.']
    },
    director: {
      type: String,
      required: [true, 'O diretor do filme é obrigatório.'],
      trim: true,
      maxlength: [120, 'O nome do diretor não pode exceder 120 caracteres.']
    },
    year: {
      type: Number,
      required: [true, 'O ano de lançamento é obrigatório.'],
      min: [1888, 'O ano do filme não pode ser anterior a 1888 (invenção do cinema).'],
      max: [new Date().getFullYear() + 5, 'O ano do filme não pode ser muito superior ao ano atual.']
    },
    genre: {
      type: String,
      required: [true, 'O gênero do filme é obrigatório.'],
      trim: true,
      maxlength: [80, 'O gênero não pode exceder 80 caracteres.']
    },
    coverUrl: {
      type: String,
      required: [true, 'A URL da capa é obrigatória.'],
      trim: true,
      validate: {
        validator: function (value) {
          return /^https?:\/\/.+/i.test(value);
        },
        message: 'A URL da capa deve iniciar com http:// ou https://'
      }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Formatação amigável ao serializar para JSON
movieSchema.method('toJSON', function () {
  const { _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
