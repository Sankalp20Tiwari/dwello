import { View, Text, Dimensions, ScrollView, Image, TouchableOpacity, Platform, FlatList } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useAppwrite } from '@/lib/useAppwrite'
import { getPropertyById } from '@/lib/appwrite'
import icons from '@/constants/icons'
import images from '@/constants/images'
import { facilities } from '@/constants/data'
import Comment from '@/components/Comment'
import seed from '@/lib/seed'

const Property = () => {

    const {id} = useLocalSearchParams<{id?: string}>()

    const windowHeight = Dimensions.get("window").height;


    const {data: property, loading} = useAppwrite({
      fn: getPropertyById,
      params: {
        id: id!
      }
    })


  return (
    <View >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32 bg-white'
      >
        <View 
          className='relative w-full'
          style={{height: windowHeight/2}}
          >
            <Image 
              source={{uri: property?.image}}
              className='size-full'
              resizeMode='cover'
            />
            <Image
            source={images.whiteGradient}
            className="absolute top-0 w-full z-40"
            />
            <View
              className='z-50 absolute inset-x-7'
              style={{
                top: Platform.OS === "ios" ? 70 : 20,
              }}
             >
              <View className='flex flex-row items-center w-full justify-between'>
                <TouchableOpacity
                  onPress={() => router.back()}
                 >
                  <Image 
                    source={icons.backArrow}
                    className='size-8'
                  />
                </TouchableOpacity>
                <View className='flex flex-row items-center gap-3'>
                  <Image 
                    source={icons.heart}
                    className='size-7'
                    tintColor={"#191D331"}
                  />
                  <Image 
                    source={icons.send}
                    className='size-7 '
                    tintColor={"#0061ff"}
                  />
                </View>
              </View>
            </View>
        </View>

        <View className='flex mt-5 px-5 gap-2'>
          <Text className='text-2xl font-rubik-semibold text-black-300'>
            {property?.name}
          </Text>

          <View className='flex flex-row items-center gap-3'>
            <View className='flex flex-row items-center justify-between p-2 bg-primary-200  rounded-full'>
              <Text className='text-xs font-rubik text-primary-300'>
                {property?.type}
              </Text>
            </View>
              <View className='flex flex-row items-center gap-1 '>
                <Image 
                source={icons.star}
                className='size-5'
                />
                <Text className='text-black-200 text-sm mt-1 font-rubik-medium'>
                  {property?.rating} ({property?.reviews.length} reviews)
                </Text>
              </View>
            </View>
            <View className='flex flex-row items-center justify-center mt-5 gap-8'>
              <View className='flex flex-row items-center justify-center gap-2 '>
              <View className='bg-primary-200 rounded-full size-10 items-center justify-center'>
                <Image 
                  source={icons.bed}
                  className='size-5'
                />
                </View>
                <Text  className="text-black-300 text-sm font-rubik-medium ">
                  {property?.bedrooms} Beds
                </Text>
              </View>
              <View className='flex flex-row items-center gap-2'>
              <View className='bg-primary-200 rounded-full size-10 items-center justify-center'>
                <Image 
                  source={icons.bath}
                  className='size-5'
                />
                </View>
                <Text  className="text-black-300 text-sm font-rubik-medium ">
                  {property?.bathrooms} Bathrooms
                </Text>
              </View>
              <View className='flex flex-row items-center gap-2'>
              <View className='bg-primary-200 rounded-full size-10 items-center justify-center'>
                <Image 
                  source={icons.area}
                  className='size-5'
                />
                </View>
                <Text  className="text-black-300 text-sm font-rubik-medium ">
                  {property?.area} sqft
                </Text>
              </View>
            </View>  
            
            <View className='flex flex-col mt-5 border-t border-primary-200'>
              <Text className='font-rubik-semibold mt-5 text-black-300 text-xl'>
                Agent
              </Text>
              <View className='flex flex-row items-center mt-4'>
                <Image 
                  source={{uri: property?.agent.avatar}}
                  className='size-20 rounded-full'
                  resizeMode='cover'
                 /> 
                 <View className='flex flex-col items-start justify-center ml-3  '>
                  <Text className='font-rubik-semibold '>
                    {property?.agent.name}
                  </Text>
                  <Text className='text-base text-black-200'>
                    {property?.agent.email}
                  </Text>
                 </View>
                 <View className='flex flex-row items-center gap-4 ml-20' >
                 <Image source={icons.chat} className="size-8" />
                 <Image source={icons.phone} className="size-8" />
                 </View>
              </View>
            </View>

            <View className='flex flex-col mt-5'>
            <Text className='font-rubik-semibold  text-black-300 text-xl'>
              Overview
            </Text>
            <Text>
              {property?.description}
            </Text>
          </View>

          <View className="mt-7">
            <Text className="text-black-300 text-xl font-rubik-bold">
              Facilities
            </Text>

            {property?.facilities.length > 0 && (
              <View className="flex flex-row flex-wrap items-start justify-start mt-2 gap-5">
                {property?.facilities.map((item: string, index: number) => {
                  const facility = facilities.find(
                    (facility) => facility.title === item
                  );

                  return (
                    <View
                      key={index}
                      className="flex flex-1 flex-col items-center min-w-16 max-w-20"
                    >
                      <View className="size-14 bg-primary-100 rounded-full flex items-center justify-center">
                        <Image
                          source={facility ? facility.icon : icons.info}
                          className="size-6"
                        />
                      </View>

                      <Text
                      numberOfLines={2}
                        className="text-black-300 text-sm text-center font-rubik mt-1.5"
                      >
                        {item}
                      </Text>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
          
          {property?.gallery.length > 0 && (
            <View className='mt-5'> 
                <Text className='font-rubik-semibold text-black-300 text-xl'>
                  Gallery
                </Text>
                <FlatList 
                  data={property?.gallery}
                  keyExtractor={(item) => item.$id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName='flex gap-4 mt-3'
                  contentContainerStyle={{paddingBottom: 20}}
                  renderItem={({item}) => (
                    <Image 
                      source={{uri: item.image}}
                      className='w-40 h-40 rounded-lg'
                      resizeMode='cover'
                    />
                  )}
                />
            </View>
          )}

          <View className='flex flex-col items-start gap-2 mt-5'>
            <Text className='font-rubik-semibold text-black-300 text-xl'>
              Location
            </Text>
            <View className='flex flex-row items-center gap-2 justify-center'>
              <Image
                source={icons.location}
                className="size-6"
              />
              <Text className="text-black-300 text-lg font-rubik-medium">
                {property?.address}
              </Text>
            </View>
            <Image
              source={images.map}
              className="w-full h-60 rounded-lg"
              resizeMode="cover"
            />
          </View>
          
          {property?.reviews.length > 0 && (
            <View className='mt-5'>
                  <View className='flex flex-row items-center justify-between'>
                    <View className='flex flex-row items-center gap-2 '>
                      <Image 
                        source={icons.star}
                        className='size-6'
                      />
                      <Text className='text-black-300 text-lg mt-1 font-rubik-medium'>
                        {property?.rating} ({property?.reviews.length} reviews)
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <Text className='text-primary-300 text-lg font-rubik-medium'>
                        Swipe to see all
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View className='mt-5'>
                    <FlatList 
                      data={property?.reviews}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerClassName='flex gap-4 mt-3'
                      keyExtractor={(item) => item.$id}
                      renderItem={({item}) => (
                         <View className='w-96 h-60 border rounded-xl border-primary-200 
                         items-center justify-center ml-2 '>
                          <View className='mx-2'>
                          <Comment item={item} />
                          </View>
                        </View>
                      )}
                    />
                  </View>
            </View>
          )}
          </View>
      </ScrollView>
      <View className='absolute flex flex-row items-center justify-between bottom-2
      border-t border-b border-r border-l border-primary-200 rounded-full h-20 bg-white w-full p-5'>
        <View>
          <Text className='text-sm font-rubik-medium text-black-200'>
            PRICE
          </Text>
          <Text className='text-2xl text-start font-rubik-bold text-primary-300'>
            ${property?.price}
          </Text>
        </View>
        <TouchableOpacity className='w-60 h-16 flex flex-row items-center justify-center
              bg-primary-300 rounded-full py-3 shadow-md shadow-zinc-400 '>
          <Text className='text-white text-lg font-rubik-semibold text-center'>
            Book Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )

}

export default Property