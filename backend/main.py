from routes.generations import router as generations_router

# Include your new router inside app
app.include_router(generations_router)