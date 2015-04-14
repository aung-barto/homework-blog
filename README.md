##homework-blog

###Don't Be Hangry
This blog app is about food. Searching and posting about food.
####SEARCH
1. Users of this site can search for recipes with these combinations:

	 a dish name by itself, 
	 a dish name from a website,
	 a dish name determined by the cooking time,
	 a dish from a website determined by the cooking time

2. After the user hits the search button, a page with recipe results will render with dish names, source pages, images, cooking time, and required ingredients. Each recipe has a link to take them to cooking directions.

####BLOG
1. User(s) can create a new blog post by clicking on "NEW POST" link at the top corner to enter:

	blog title
	image URL
	body of blog/ content
	label for URL link
	URL link

2. Once information is entered user can click "SUBMIT". Index page will render with new post added at the top.

3. User can click directly at the blog post title. When a new page render user should be able to "EDIT POST" at the top corner of the page and "DELETE POST" at the bottom of the page.

4. If user choose to edit a post, this will take them another page where they can edit every item. Once editing is completed user will have a chance to view the edited post before clicking on "BLOG & SEARCH", to navigate back to the index page and see the posts in the same order.

5. If user choose to delete a post, a confirmation box must be checked before clicking on "DELETE POST" button. After the post is deleted, user will be returned to the index page.

####ERD

blog'---- * post
blog'---- * search'---- * result