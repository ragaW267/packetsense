import Link from "next/link";
import { Network } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold gradient-text">PacketSense</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive networking learning and troubleshooting for engineering students.
            </p>
          </div>

          {/* Learn */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Learn</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/protocols" className="hover:text-primary transition-colors">Protocol Visualizer</Link></li>
              <li><Link href="/quiz" className="hover:text-primary transition-colors">Quizzes</Link></li>
              <li><Link href="/explain" className="hover:text-primary transition-colors">AI Explain</Link></li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Tools</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/troubleshoot" className="hover:text-primary transition-colors">Troubleshoot Wizard</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">Topics</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>TCP/IP</li>
              <li>DNS &amp; DHCP</li>
              <li>Routing &amp; Switching</li>
              <li>OSI Model</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PacketSense. Built for students, by students.
        </div>
      </div>
    </footer>
  );
}
