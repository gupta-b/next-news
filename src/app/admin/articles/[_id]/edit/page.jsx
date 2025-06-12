"use client"

import { useState,useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useSearchParams } from 'next/navigation'

  const availableLanguages = [
    { code: "en", name: "English", required: true },
    { code: "hi", name: "Hindi" },
    { code: "guj", name: "Gujarati" }];

// Form schema
const formSchema = z.object({
  titleEn: z
    .string()
    .max(100, {
      message: "Title must not be more than 100 characters.",
    })
    .min(5, {
      message: "Title must be at least 5 characters.",
    }),
  // titleHi: z
  //   .string()
  //   .max(100, {
  //     message: "Title must not be more than 100 characters.",
  //   })
  //   .min(5, {
  //     message: "Title must be at least 5 characters.",
  //   }).optional(), 
  titleGuj: z
    .string().optional(),
  category: z.string({
    required_error: "Please select a category.",
  }),
  URLs: z
    .string()
    .transform((val) =>
      val
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "")
  ),
  role: z.string({
    required_error: "Please select a role.",
  }).min(1, {
      message: "Please select a role.",
    }),
  category: z.string({
    required_error: "Please select a category.",
  }).min(1, {
      message: "Please select a category.",
    }),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status.",
  }),
  fromDate: z.date({
    required_error: "Please select a from date.",
  }),
  toDate: z.date({
    required_error: "Please select a to date.",
  }),
  hashtags: z.string().optional(),
  langCheck: z.array(z.string()),
  bodyEn: z.string().min(10, {
    message: "English content must be at least 10 characters.",
  }),
  // bodyGuj: z.string().min(10, {
  //   message: "Gujarati content must be at least 10 characters.",
  // }),
  // bodyHi: z.string().min(10, {
  //   message: "Hindi content must be at least 10 characters.",
  // }),
})
// .superRefine((input, refinementContext) => {
//   console.log({input})
//   const { URLs} = input;
//    if (URLs && URLs.length && !URLs.every((url) => /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url))) {
//       return refinementContext.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Enter valid URLs separated by commas",
//         path: ['URLs'],
//       });
//     }
//     return true;
// }
// )

export default function NewUserPage({params}) {

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { _id } = use(params);

// const searchParams = useSearchParams()   
// const search = searchParams.get('_id');
  useEffect(() => {
    const fetchSelectedData = async() => {

      try {
      const article = await axios.get(`/api/articles/${_id}`);
      if (article && article.data) {
        const {data} = article;
        const URLsString = Array.isArray(data.URLs) ? data.URLs.join(", ") : data.URLs || ""
        const hashtagsString = Array.isArray(data.hashtags) ? data.hashtags.join(", ") : data.hashtags || ""
        form.reset({
            langCheck:["en", 'hi', 'guj'],
            titleEn: data.titleEn,
            titleGuj: data.titleGuj,
            titleHi: data.titleHi,
            category: data.category,
            URLs: URLsString,
            role: data.role,
            status: data.status,
            fromDate: new Date(data.fromDate),
            toDate: new Date(data.toDate),
            hashtags: hashtagsString,
            bodyEn: data.bodyEn,
            bodyHi: data.bodyHi || "",
            bodyGuj: data.bodyGuj || "",
          })
      }
    } catch (error) {
      const axiosError = error;
      console.log('\x1b[36m%s\x1b[0m', axiosError);
    } finally {
      
    }
    } 
    if (_id) {
      fetchSelectedData();
    }
    // return () => {}
  }, [_id]);
  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titleEn: "",
      titleGuj: "",
      titleHi: "",
      category: "",
      URLs: "",
      status: "active",
      role: "Editor",
      hashtags: "",
      bodyEn: "",
      bodyHi: "",
      bodyGuj: "",
      langCheck:["en"],
      fromDate: new Date(),
      toDate: new Date(),
    },
  })

  // Form submission handler
  async function onSubmit(values, publishStatus) {
    setIsSubmitting(true)
    console.log({values})
    const submissionData = {
      ...values,
      mode: publishStatus,
      hashtags: values?.hashtags?.split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    }
    if (!values.langCheck.includes('hi')) {
        submissionData.titleHi = values.titleEn;
        submissionData.bodyHi = values.bodyEn;
    }
    if (!values.langCheck.includes('guj')) {
        submissionData.titleGuj = values.titleEn;
        submissionData.bodyGuj = values.bodyEn;
    }

    console.log("Submitting:", submissionData);
    try {
      await axios.put(`/api/articles/${_id}`, submissionData)
      router.push("/admin/articles")

    } catch (error) {
      console.error('Insert failed:', error);
    }
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/articles")
    }, 1000)
  }
// Handle language selection
  
  const langSelected = form.watch("langCheck");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Article</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6">
           <FormField
                control={form.control}
                name="langCheck"
                render={({ field, ...rest }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-base font-medium">Languages of Interest</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border rounded-md bg-muted/50">
                        {availableLanguages.map((lang) => (
                          <div key={lang.code} className="flex items-center space-x-2">
                            <Checkbox
                              id={`lang-${lang.code}`}
                              checked={field.value.includes(lang.code)}
                              onCheckedChange={(checked) => {
                                const updatedLangs = checked
                                  ? [...field.value, lang.code]
                                  : field.value.filter((langCode) => langCode !== lang.code)

                                field.onChange(updatedLangs)
                              }}
                            />
                            <label htmlFor={`lang-${lang.code}`} className="text-sm font-normal cursor-pointer">
                              {lang.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Select the languages for article's content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (En)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormDescription>Article title in English (5-100 characters)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               {
              langSelected.includes('hi') ?
              <FormField
                control={form.control}
                name="titleHi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Hi)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormDescription>Article title Hindi (5-100 characters)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> :
              ''
            }
             {
              langSelected.includes('guj') ?
              <FormField
                control={form.control}
                name="titleGuj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Guj)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} />
                    </FormControl>
                    <FormDescription>Article title Gujarati (5-100 characters)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> :
              ''
              }
              
              
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>From Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // value={field.value}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Article publication start date</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>To Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Article publication end date</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hashtags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hashtags</FormLabel>
                  <FormControl>
                    <Input placeholder="technology, news, trending (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter hashtags separated by commas (e.g., technology, news, trending)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="URLs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URLs</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/1.jpg, https://example.com/2.jpg" {...field} />
                    </FormControl>
                    <FormDescription>Enter multiple image URLs separated by commas.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select author role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Editor">Editor</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Writer">Writer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Select the author's role</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Set the article status</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="bodyEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (English)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your article content in English..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Main article content in English</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              langSelected.includes('hi') ? 
                <FormField
                control={form.control}
                name="bodyHi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Hindi) - Optional</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your article content in Hindi..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Article content in Hindi (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              : ''
            }
            {
              langSelected.includes('guj') ?
               <FormField
                control={form.control}
                name="bodyGuj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (Gujarati) - Optional</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your article content in Gujarati..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Article content in Gujarati (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> :
              ''
            }

            <div className="flex items-center justify-between gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/articles")}>
                Cancel
              </Button>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit((values) => onSubmit(values, "draft"))}
                >
                  {isSubmitting ? "Saving..." : "Save as Draft"}
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={form.handleSubmit((values) => onSubmit(values, "published"))}
                >
                  {isSubmitting ? "Publishing..." : "Publish Article"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

