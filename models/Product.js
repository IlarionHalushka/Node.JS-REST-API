import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema(
  {
    name: {
      $type: String,
      required: true,
    },
    photos: {
      $type: [String],
      default: [],
    },
    active: {
      $type: Boolean,
      default: true,
    },
    type: {
      $type: String,
      required: true,
      default: 'EVENT',
      enum: ['EVENT', 'PROGRAM', 'YOUTH_PROGRAM'],
    },
    phone: String,
    about: String,
    address: String,
    location: {
      type: {
        $type: String,
        default: 'Point',
      },
      coordinates: {
        $type: [Number], // [longitude, latitude]
        default: undefined,
      },
    },
    provider: {
      $type: String,
    },
    startDate: {
      $type: Date,
    },
    endDate: {
      $type: Date,
    },
    days: {
      $type: String,
    },
    times: {
      $type: String,
    },
    parsedFromLocationId: {
      $type: mongoose.Schema.Types.ObjectId,
      ref: 'LaunchedLocation',
    },
    featured: {
      $type: Boolean,
      required: true,
      default: false,
    },
    categories: {
      $type: [{ $type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
      default: [],
    },
    additional: {
      $type: Object,
    },
    ages: {
      from: {
        $type: Number,
        min: 0,
        max: 100,
      },
      to: {
        $type: Number,
        min: 0,
        max: 100,
      },
    },
    rating: {
      $type: Number,
      default: 0,
    },
    reviews: {
      $type: Array,
      default: [],
    },
    website: String,
    facebook: String,
    google: String,
    yelp: String,
    source: {
      $type: String,
    },
    parsedFrom: {
      $type: String,
      enum: ['GOOGLE', 'FACEBOOK', 'YELP'],
    },
    updatedBy: {
      $type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedAt: {
      $type: Date,
    },
    createdAt: {
      $type: Date,
      required: true,
      default: () => new Date(),
      index: true,
    },
  },
  {
    typeKey: '$type',
  },
);

ActivitySchema.index({ location: '2dsphere' });
ActivitySchema.index({ active: 1 });

ActivitySchema.pre('update', function preUpdate(next) {
  const query = this.getUpdate();
  query.$set.updatedAt = new Date();

  next();
});

ActivitySchema.pre('save', function preSave(next) {
  const coordinatesExist =
    this.location &&
    Array.isArray(this.location.coordinates) &&
    this.location.coordinates.length === 2;

  if (this.isNew && !coordinatesExist) {
    this.location = undefined;
  }

  next();
});

ActivitySchema.pre('save', function preSave(next) {
  if (this.isNew) {
    const currentDate = new Date();

    this.updatedAt = currentDate;
    this.createdAt = currentDate;
  }

  next();
});

const model = mongoose.model('Activity', ActivitySchema);

export default model;
