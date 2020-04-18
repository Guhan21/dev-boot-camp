const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Copy of req.query
  const reqQuery = { ...req.query };

  // Finding resources
  if (req.query) {
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((field) => delete reqQuery[field]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = model.find(JSON.parse(queryStr));
    if (populate) {
      query = query.populate(populate);
    }
  } else {
    query = model.find();
  }

  // Selecting Fields

  if (req.query.select) {
    const fields = req.query.select.replace(",", " ");
    query = query.select(fields);
  }

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(",", " ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const limit = parseInt(req.query.limit, 10) || 5;
  const page = parseInt(req.query.page, 10) || 1;
  const startIndex = limit * (page - 1);
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const resources = await query;

  // Pagination Result

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.advancedResults = {
    success: true,
    count: resources.length,
    pagination,
    data: resources,
  };

  next();
};

module.exports = advancedResults;
