### Not Found Middleware

Create a middleware that handles requests to non-existing paths.

1. Create a middleware method before the `listen` method.

```js
app.use((req, res, next) => {});
```

2. This middleware should end the response with a `404` status code and a message that says `Path Not Found`.

```js
app.use((req, res, next) => {
  res.status(404).json({ message: 'Path not found' });
});
```

3. Test your middleware by sending a request to a non-existing path, for example `/whatever`.

### Error Handling Middleware

Create a middleware that handles all the errors in your application.

1. Pass four arguments to your middleware's function: `err`, `req`, `res` and `next`.

```js
app.use((err, req, res, next) => {});
```

2. Set the response status to the error object's status. If it doesn't have a status, give it a default status of `500`.

```js
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message || 'Internal Server Error',
  });
});
```

3. Send an object with the message from the error object as a JSON response. If the error object doesn't have a message, give it the following default message `Internal Server Error`.

### Fetch Post Function

In `controllers.js`, create a function called `fetchPost` that handles finding a post from the database by its ID.

1. Pass this function two arguments: `postId` `next`.

```js
exports.fetchPost = async (postId, next) => {};
```

2. In a `try catch` statement, fetch the post by passing `postId` to `findById` if it exist.

```js
exports.fetchPost = async (postId, next) => {
  try {
    const post = await Post.findById(postId);
  } catch (error) {}
};
```

3. Return the found post.

```js
exports.fetchPost = async (postId, next) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (error) {}
};
```

4. In your `catch` block, pass the error to `next` to trigger the error handling middleware.

```js
exports.fetchPost = async (postId, next) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (error) {
    next(error);
  }
};
```

#### Router Param

In `routes.js`, create a `param` middleware that handles fetching a post and saving it in the request object.

1. Create a `router.param` middleware that handles `postId` route parameters.

```js
router.param('postId');
```

2. Pass four arguments to this middleware's function: `req`, `res`, `next` and `postId`.

```js
router.param('postId', async (req, res, next, postId) => {});
```

3. Require `fetchPost`, call it, pass it `postId` and `next`, and save the returned value in a variable called `post`.

```js
router.param('postId', async (req, res, next, postId) => {
  const post = await fetchPost(+postId, next);
});
```

4. If `post` exists, save it in the request object.

```js
router.param('postId', async (req, res, next, postId) => {
  const post = await fetchPost(+postId, next);
  if (post) {
    req.post = post;
  }
});
```

5. Else, create an error object with the message `Post Not Found` or your own message.

```js
router.param('postId', async (req, res, next, postId) => {
  const post = await fetchPost(+postId, next);
  if (post) {
    req.post = post;
    next();
  } else {
    const err = new Error('Post Not Found');
  }
});
```

6. Change the error object's status code to `404`.

```js
router.param('postId', async (req, res, next, postId) => {
  const post = await fetchPost(+postId, next);
  if (post) {
    req.post = post;
    next();
  } else {
    const err = new Error('Post Not Found');
    err.status = 404;
  }
});
```

7. Pass the error object to `next` to trigger the error handling middleware.

```js
router.param('postId', async (req, res, next, postId) => {
  const post = await fetchPost(+postId, next);
  if (post) {
    req.post = post;
    next();
  } else {
    const err = new Error('Post Not Found');
    err.status = 404;
    next(err);
  }
});
```

#### Cleanup

1. Remove all the extra code in all the controllers that are using `router.param`.

```js
exports.postsUpdate = async (req, res) => {
  try {
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.postsDelete = async (req, res) => {
  try {
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
```

2. Access the post from the request object.

```js
exports.postsUpdate = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.post.id, req.body);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.postsDelete = async (req, res) => {
  try {
    await Post.findByIdAndRemove(req.post.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
```

3. Test your routes to make sure they're working properly.

### 🍋 Slug Middleware

Create a custom middleware when creating a blog that generates a slug for the blog title and adds it to the request.

1. Start by installing `slugify` package:

```shell
npm i slugify
```

2. Create a middleware in your routes file:

```js
router.use((req, res, next) => {});
```

3. Check the type of the request, we need to run the middleware on the `Post` create post route:

```js
router.use((req, res, next) => {
  if (req.method === 'POST') {
  }
});
```

4. Create a slug using the slugify package and save it in `req.body.slug`. And lastly call `next()`.

```js
router.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.slug = slugify(req.body.title);
  }
  next();
});
```

### 🌶 Validation Middleware

Use a validation middleware [library](https://www.npmjs.com/package/express-validation).

Validate that the `title` argument contains letters and not only numbers, and does not exceed 40 character.

1. Install the `express-validation` package:

```shell
npm i express-validation
```

2. In your routes file, import the following:

```js
const { validate, ValidationError, Joi } = require('express-validation');
```

3. Define your validation rules:

```js
const postValidation = {
  body: Joi.object({
    title: Joi.string().max(40).required(),
  }),
};
```

4. Apply your validation rules on your desired route:

```js
router.post('/', validate(postValidation, {}, {}), postsCreate);
```
