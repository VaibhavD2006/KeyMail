import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { 
  getListingsByUserId, 
  saveListing, 
  getListingById, 
  getListingByMlsId 
} from "@/lib/db/queries-mongodb";
import { Listing } from "@/lib/db/models";

// GET /api/listings - Get all listings for a user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const propertyType = searchParams.get("propertyType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const neighborhood = searchParams.get("neighborhood");

    // Build MongoDB query
    const query: any = { userId: session.user.id };

    if (search) {
      query.address = { $regex: search, $options: 'i' };
    }

    if (status) {
      query.status = status;
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (neighborhood) {
      query.neighborhood = neighborhood;
    }

    const listingsResult = await Listing.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: listingsResult,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      mlsId, 
      address, 
      city, 
      state, 
      zipCode, 
      price, 
      description, 
      photos, 
      features, 
      bedrooms, 
      bathrooms, 
      squareFeet, 
      lotSize, 
      propertyType, 
      neighborhood, 
      status = "active" 
    } = await request.json();

    if (!mlsId || !address || !city || !state || !zipCode || !price) {
      return NextResponse.json(
        { error: "MLS ID, address, city, state, zip code, and price are required" },
        { status: 400 }
      );
    }

    // Check if MLS ID already exists for this user
    const existingListing = await getListingByMlsId(mlsId);

    if (existingListing && existingListing.userId === session.user.id) {
      return NextResponse.json(
        { error: "A listing with this MLS ID already exists" },
        { status: 409 }
      );
    }

    // Create listing
    const listingData = {
      userId: session.user.id,
      mlsId,
      address,
      city,
      state,
      zipCode,
      price: parseInt(price),
      description,
      photos: photos || [],
      features: features || [],
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseFloat(bathrooms) : undefined,
      squareFeet: squareFeet ? parseInt(squareFeet) : undefined,
      lotSize: lotSize ? parseFloat(lotSize) : undefined,
      propertyType,
      neighborhood,
      status,
    };

    const result = await saveListing(listingData);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

// PUT /api/listings - Update an existing listing
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      listingId, 
      mlsId, 
      address, 
      city, 
      state, 
      zipCode, 
      price, 
      description, 
      photos, 
      features, 
      bedrooms, 
      bathrooms, 
      squareFeet, 
      lotSize, 
      propertyType, 
      neighborhood, 
      status 
    } = await request.json();

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Get existing listing
    const existingListing = await getListingById(listingId);

    if (!existingListing || existingListing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if MLS ID already exists for another listing by this user
    if (mlsId && mlsId !== existingListing.mlsId) {
      const duplicateListing = await getListingByMlsId(mlsId);

      if (duplicateListing && duplicateListing.userId === session.user.id && duplicateListing._id.toString() !== listingId) {
        return NextResponse.json(
          { error: "A listing with this MLS ID already exists" },
          { status: 409 }
        );
      }
    }

    // Update listing
    const updateData: any = {};
    if (mlsId !== undefined) updateData.mlsId = mlsId;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (price !== undefined) updateData.price = parseInt(price);
    if (description !== undefined) updateData.description = description;
    if (photos !== undefined) updateData.photos = photos;
    if (features !== undefined) updateData.features = features;
    if (bedrooms !== undefined) updateData.bedrooms = bedrooms ? parseInt(bedrooms) : null;
    if (bathrooms !== undefined) updateData.bathrooms = bathrooms ? parseFloat(bathrooms) : null;
    if (squareFeet !== undefined) updateData.squareFeet = squareFeet ? parseInt(squareFeet) : null;
    if (lotSize !== undefined) updateData.lotSize = lotSize ? parseFloat(lotSize) : null;
    if (propertyType !== undefined) updateData.propertyType = propertyType;
    if (neighborhood !== undefined) updateData.neighborhood = neighborhood;
    if (status !== undefined) updateData.status = status;

    const result = await Listing.findByIdAndUpdate(
      listingId,
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

// DELETE /api/listings - Delete a listing
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Verify listing belongs to user
    const existingListing = await getListingById(listingId);

    if (!existingListing || existingListing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Delete listing
    await Listing.findByIdAndDelete(listingId);

    return NextResponse.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
