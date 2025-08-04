"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ExternalLink } from "lucide-react"

export function EnvCheck() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    return null // Environment variables are set, don't show anything
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold">Setup Required</span>
          </div>
          <CardTitle className="text-2xl">Supabase Configuration Missing</CardTitle>
          <CardDescription className="text-gray-300">
            Please configure your Supabase environment variables to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-400">Step 1: Create Supabase Project</h3>
            <p className="text-sm text-gray-300 mb-2">
              Go to{" "}
              <a
                href="https://database.new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 inline-flex items-center"
              >
                database.new <ExternalLink className="h-3 w-3 ml-1" />
              </a>{" "}
              and create a new Supabase project.
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-400">Step 2: Get Your Credentials</h3>
            <p className="text-sm text-gray-300 mb-2">
              In your Supabase dashboard, go to{" "}
              <a
                href="https://supabase.com/dashboard/project/_/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-yellow-300 inline-flex items-center"
              >
                Settings → API <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
            <p className="text-sm text-gray-300">Copy your Project URL and anon/public key.</p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-400">Step 3: Create Environment File</h3>
            <p className="text-sm text-gray-300 mb-2">
              Create a <code className="bg-gray-600 px-1 rounded">.env.local</code> file in your project root:
            </p>
            <div className="bg-gray-900 p-3 rounded text-sm font-mono">
              <div className="text-green-400"># .env.local</div>
              <div className="text-gray-300">NEXT_PUBLIC_SUPABASE_URL=your_project_url_here</div>
              <div className="text-gray-300">NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here</div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-yellow-400">Step 4: Run Database Setup</h3>
            <p className="text-sm text-gray-300 mb-2">
              Execute the SQL scripts in your Supabase SQL Editor to create the required tables and functions.
            </p>
            <p className="text-sm text-gray-400">
              The scripts are located in the <code className="bg-gray-600 px-1 rounded">scripts/</code> folder.
            </p>
          </div>

          <div className="bg-yellow-400 text-black p-4 rounded-lg">
            <p className="text-sm font-medium">
              💡 After setting up the environment variables, restart your development server with{" "}
              <code className="bg-black/20 px-1 rounded">npm run dev</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
