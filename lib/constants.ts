export const GITHUB_LINK="https://github.com/Aayush6377"
export const LINKEDIN_LINK="https://www.linkedin.com/in/aayush-kukreja-b5885324a"
export const PORTFOLIO_LINK="https://aayush-kukreja-portfolio.vercel.app"

export const codeSnippets = [
{
    language: "Java",
    file: "Main.java",
    command: "$ javac Main.java && java Main",
    code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Welcome to RunIt!");\n  }\n}`,
    output: "Welcome to RunIt!"
  },
  {
    language: "C",
    file: "main.c",
    command: "$ gcc main.c && ./a.out",
    code: `#include <stdio.h>\n\nint main() {\n  printf("Welcome to RunIt!\\n");\n  return 0;\n}`,
    output: "Welcome to RunIt!"
  },
  {
    language: "C++",
    file: "main.cpp",
    command: "$ g++ main.cpp && ./a.out",
    code: `#include <iostream>\n\nint main() {\n  std::cout << "Welcome to RunIt!\\n";\n  return 0;\n}`,
    output: "Welcome to RunIt!"
  },
  {
    language: "JavaScript",
    file: "main.js",
    command: "$ node main.js",
    code: `console.log("Welcome to RunIt!");`,
    output: "Welcome to RunIt!"
  },
  {
    language: "TypeScript",
    file: "main.ts",
    command: "$ ts-node main.ts",
    code: `const message: string = "Welcome to RunIt!";\nconsole.log(message);`,
    output: "Welcome to RunIt!"
  },
  {
    language: "Python",
    file: "main.py",
    command: "$ python main.py",
    code: `print("Welcome to RunIt!")`,
    output: "Welcome to RunIt!"
  },
  {
    language: "Go",
    file: "main.go",
    command: "$ go run main.go",
    code: `package main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Welcome to RunIt!")\n}`,
    output: "Welcome to RunIt!"
  },
  {
    language: "Rust",
    file: "main.rs",
    command: "$ rustc main.rs && ./main",
    code: `fn main() {\n  println!("Welcome to RunIt!");\n}`,
    output: "Welcome to RunIt!"
  },
  {
    language: "C#",
    file: "Program.cs",
    command: "$ dotnet run",
    code: `using System;\n\nclass Program {\n  static void Main() {\n    Console.WriteLine("Welcome to RunIt!");\n  }\n}`,
    output: "Welcome to RunIt!"
  },
  {
    language: "PHP",
    file: "main.php",
    command: "$ php main.php",
    code: `<?php\necho "Welcome to RunIt!\\n";`,
    output: "Welcome to RunIt!"
  },
  {
    language: "Ruby",
    file: "main.rb",
    command: "$ ruby main.rb",
    code: `puts "Welcome to RunIt!"`,
    output: "Welcome to RunIt!"
  },
  {
    language: "Kotlin",
    file: "Main.kt",
    command: "$ kotlinc Main.kt -include-runtime -d main.jar && java -jar main.jar",
    code: `fun main() {\n  println("Welcome to RunIt!")\n}`,
    output: "Welcome to RunIt!"
  },
  {
    language: "Swift",
    file: "main.swift",
    command: "$ swift main.swift",
    code: `print("Welcome to RunIt!")`,
    output: "Welcome to RunIt!"
  },
  {
    language: "Bash",
    file: "main.sh",
    command: "$ bash main.sh",
    code: `echo "Welcome to RunIt!"`,
    output: "Welcome to RunIt!"
  }
];