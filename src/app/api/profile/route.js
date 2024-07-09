import Profile from "@/models/Profile";
import User from "@/models/User";
import connectDB from "@/utils/connectDB";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  //dar inja baraye inke etelaati ke profile behemun mide shamele id karbar ham hast yek ghabeliati ke mongoose dar ekhtiar ma gharar mide function select ast ke ba estefade az oon mitunim etelaat rea mahdud konim.
  //baraye inke tayeen konim che chizi ro mikhim ya nemikhahim mitavanim az - estefade konim.
  const profiles = await Profile.find({ published: true }).select("-userId");

  return NextResponse.json({ data: profiles }, { status: 200 });
  try {
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    await connectDB();

    const {
      title,
      description,
      location,
      phone,
      realState,
      price,
      constructionDate,
      amenities,
      rules,
      category,
    } = await req.json();

    //baraye inke bebinim karbar ehraze hoviat shode ya na
    const session = await getServerSession(req);

    //baraye inke age karbar nabood vared hesabe karbarish beshe
    if (!session) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    //migim in karbar ro peyda bokon
    const user = await User.findOne({ email: session.user.email });

    //agar hesab vojud nadasht error bede
    if (!user) {
      return NextResponse({ error: "حساب کاربری یافت نشد" }, { status: 404 });
    }

    //check mikonim ke etelaat be dorosti vared shode ya na .agar na ke error bede.
    if (
      !title ||
      !location ||
      !description ||
      !phone ||
      !realState ||
      !price ||
      !constructionDate ||
      !category
    ) {
      return NextResponse.json(
        { error: "لطفا اطلاعات معتبر وارد کنید" },
        { status: 400 }
      );
    }

    //inja ba estefade az modele Profile miam yek profile ijad mikonim.
    const newProfile = await Profile.create({
      title,
      description,
      location,
      phone,
      realState,
      constructionDate,
      amenities,
      rules,
      category,
      //chon momkene price e ke miad be surate reshte bashe besurate zir minevisim.
      price: +price,
      //dar bala user ro gereftim.az oon estefade mikonim baraye ijade in ghesmat.az Type mongoDB estefade mikonim.
      userId: new Types.ObjectId(user._id),
    });

    return NextResponse.json(
      {
        message: "آگهی با موفقیت ویرایش شد",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}
export async function PATCH(req) {
  try {
    await connectDB();

    const {
      _id,
      title,
      description,
      location,
      phone,
      realState,
      price,
      constructionDate,
      amenities,
      rules,
      category,
    } = await req.json();

    //baraye inke bebinim karbar ehraze hoviat shode ya na
    const session = await getServerSession(req);

    //baraye inke age karbar nabood vared hesabe karbarish beshe
    if (!session) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }
    //migim in karbar ro peyda bokon
    const user = await User.findOne({ email: session.user.email });

    //agar hesab vojud nadasht error bede
    if (!user) {
      return NextResponse({ error: "حساب کاربری یافت نشد" }, { status: 404 });
    }

    //check mikonim ke etelaat be dorosti vared shode ya na .agar na ke error bede.
    if (
      !_id ||
      !title ||
      !location ||
      !description ||
      !phone ||
      !realState ||
      !price ||
      !constructionDate ||
      !category
    ) {
      return NextResponse.json(
        { error: "لطفا اطلاعات معتبر وارد کنید" },
        { status: 400 }
      );
    }

    const profile = await Profile.findOne({ _id });
    //dar inja ba estefade az quals dar mongoose miaim va in 2 id ro ba ham moghayese mikonim va migim agar barabar nabood error bede behemoon.
    if (!user._id.equals(profile.userId)) {
      return NextResponse.json(
        { error: "دسترسی شما به این آگهی محدود شده است" },
        { status: 403 }
      );
    }

    profile.title = title;
    profile.description = description;
    profile.location = location;
    profile.phone = phone;
    profile.realState = realState;
    profile.price = price;
    profile.constructionDate = constructionDate;
    profile.amenities = amenities;
    profile.rules = rules;
    profile.category = category;
    profile.save();

    return NextResponse.json(
      {
        message: "آگهی با موفقیت ویرایش شد",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "مشکلی در سرور رخ داده است" },
      { status: 500 }
    );
  }
}
